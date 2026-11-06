/**
 * Tests des règles de sécurité Firestore (encouragements, votes payants, profils).
 * Lancer : npm run test:rules   (nécessite Java ; utilise l’émulateur local, jamais la base réelle)
 */
import { readFileSync } from 'node:fs'
import { assertFails, assertSucceeds, initializeTestEnvironment } from '@firebase/rules-unit-testing'
import { doc, getDoc, increment, setDoc, writeBatch } from 'firebase/firestore'

const env = await initializeTestEnvironment({
  projectId: 'demo-microdor',
  firestore: { rules: readFileSync('firestore.rules', 'utf8'), host: '127.0.0.1', port: 8080 },
})

let passed = 0
let failed = 0
async function test(name, fn) {
  try {
    await fn()
    passed++
    console.log('  ✔', name)
  } catch (e) {
    failed++
    console.log('  ✘', name, '\n     ', e?.message?.split('\n')[0])
  }
}

const anon = env.authenticatedContext('anon1', { firebase: { sign_in_provider: 'anonymous' } }).firestore()
const anon2 = env.authenticatedContext('anon2', { firebase: { sign_in_provider: 'anonymous' } }).firestore()
const alice = env.authenticatedContext('alice', { email: 'alice@exemple.ca', firebase: { sign_in_provider: 'password' } }).firestore()
const bob = env.authenticatedContext('bob', { email: 'bob@exemple.ca', firebase: { sign_in_provider: 'password' } }).firestore()
const kid = env.authenticatedContext('kid', { email: 'kid@exemple.ca', firebase: { sign_in_provider: 'password' } }).firestore()
const ghost = env.authenticatedContext('ghost', { email: 'ghost@exemple.ca', firebase: { sign_in_provider: 'password' } }).firestore()
const visitor = env.unauthenticatedContext().firestore()

await env.withSecurityRulesDisabled(async (ctx) => {
  const db = ctx.firestore()
  await setDoc(doc(db, 'users/alice'), { role: 'eleve', email: 'alice@exemple.ca' })
  await setDoc(doc(db, 'users/bob'), { role: 'parent', email: 'bob@exemple.ca' })
  await setDoc(doc(db, 'users/kid'), { role: 'eleve', email: 'kid@exemple.ca', details: { consentementParental: 'en_attente' } })
})

const encourage = (db, uid, tid, add = true) => {
  const b = writeBatch(db)
  const fan = doc(db, 'talents', tid, 'fans', uid)
  if (add) b.set(fan, { at: new Date() })
  else b.delete(fan)
  b.update(doc(db, 'talents', tid), { encouragements: increment(add ? 1 : -1) })
  return b.commit()
}
// achat de qty votes : bulletin complet { total, parts } + compteur du talent
const buy = (db, uid, cat, tid, qty, prev = { total: 0, parts: {} }, counterQty = qty) => {
  const b = writeBatch(db)
  const parts = { ...prev.parts, [tid]: (prev.parts[tid] ?? 0) + qty }
  b.set(doc(db, 'bulletins', `${cat}_${uid}`), { uid, category: cat, total: prev.total + qty, parts, dernier: tid, at: new Date() })
  b.update(doc(db, 'talents', tid), { votes: increment(counterQty) })
  return b.commit()
}

console.log('\nCompteurs des talents')
await test('un visiteur connecté crée un compteur à zéro', () => assertSucceeds(setDoc(doc(anon, 'talents/sarah-m'), { category: 'rap', encouragements: 0, votes: 0 })))
await test('refus : créer un compteur qui ne part pas de zéro', () => assertFails(setDoc(doc(anon, 'talents/maya-l'), { category: 'chant', encouragements: 50, votes: 0 })))
await test('refus : créer un talent inconnu', () => assertFails(setDoc(doc(anon, 'talents/faux-x'), { category: 'rap', encouragements: 0, votes: 0 })))
await test('refus : visiteur sans session', () => assertFails(setDoc(doc(visitor, 'talents/maya-l'), { category: 'chant', encouragements: 0, votes: 0 })))
await test('lecture publique des compteurs', () => assertSucceeds(getDoc(doc(visitor, 'talents/sarah-m'))))
for (const [id, cat] of [['maya-l', 'chant'], ['karim-s', 'rap'], ['jade-t', 'danse']])
  await env.withSecurityRulesDisabled((ctx) => setDoc(doc(ctx.firestore(), 'talents', id), { category: cat, encouragements: 0, votes: 0 }))

console.log('\nEncourager')
await test('un visiteur anonyme encourage Sarah', () => assertSucceeds(encourage(anon, 'anon1', 'sarah-m')))
await test('refus : encourager deux fois le même talent', () => assertFails(encourage(anon, 'anon1', 'sarah-m')))
await test('refus : +1 sans fiche « fan »', () => assertFails(writeBatch(anon).update(doc(anon, 'talents/sarah-m'), { encouragements: increment(1) }).commit()))
await test('refus : +2 d’un coup', () => {
  const b = writeBatch(anon2)
  b.set(doc(anon2, 'talents/sarah-m/fans/anon2'), { at: new Date() })
  b.update(doc(anon2, 'talents/sarah-m'), { encouragements: increment(2) })
  return assertFails(b.commit())
})
await test('refus : encourager au nom de quelqu’un d’autre', () => assertFails(encourage(anon2, 'anon1', 'maya-l')))
await test('un deuxième visiteur encourage aussi Sarah', () => assertSucceeds(encourage(anon2, 'anon2', 'sarah-m')))
await test('retirer son encouragement', () => assertSucceeds(encourage(anon, 'anon1', 'sarah-m', false)))
await test('refus : modifier les votes en encourageant', () => assertFails(writeBatch(anon).update(doc(anon, 'talents/sarah-m'), { votes: increment(1) }).commit()))

console.log('\nVotes payants')
await test('refus : un visiteur anonyme ne peut pas acheter de votes', () => assertFails(buy(anon, 'anon1', 'rap', 'sarah-m', 1)))
await test('refus : compte sans profil MICRO D’OR', () => assertFails(buy(ghost, 'ghost', 'rap', 'sarah-m', 1)))
await test('refus : élève de moins de 14 ans sans accord parental', () => assertFails(buy(kid, 'kid', 'rap', 'sarah-m', 1)))
await test('refus : l’élève retire lui-même l’attente d’accord parental', () => assertFails(setDoc(doc(kid, 'users/kid'), { role: 'eleve', email: 'kid@exemple.ca', details: {} })))
await test('Alice achète 1 vote pour Sarah (rap)', () => assertSucceeds(buy(alice, 'alice', 'rap', 'sarah-m', 1)))
const a1 = { total: 1, parts: { 'sarah-m': 1 } }
await test('Alice ajoute un forfait de 5 votes pour Sarah', () => assertSucceeds(buy(alice, 'alice', 'rap', 'sarah-m', 5, a1)))
const a6 = { total: 6, parts: { 'sarah-m': 6 } }
await test('refus : 3 votes (pas un forfait)', () => assertFails(buy(alice, 'alice', 'rap', 'sarah-m', 3, a6)))
await test('refus : dépasser le plafond de 10 votes en rap', () => assertFails(buy(alice, 'alice', 'rap', 'sarah-m', 5, a6)))
await test('refus : bulletin +1 mais compteur +5', () => assertFails(buy(alice, 'alice', 'rap', 'sarah-m', 1, a6, 5)))
await test('refus : +1 vote sans bulletin', () => assertFails(writeBatch(bob).update(doc(bob, 'talents/jade-t'), { votes: increment(1) }).commit()))
await test('refus : talent d’une autre discipline dans le bulletin rap', () => assertFails(buy(alice, 'alice', 'rap', 'jade-t', 1, a6)))
await test('refus : retirer des votes déjà achetés', () => {
  const b = writeBatch(alice)
  b.set(doc(alice, 'bulletins/rap_alice'), { uid: 'alice', category: 'rap', total: 5, parts: { 'sarah-m': 5 }, dernier: 'sarah-m', at: new Date() })
  b.update(doc(alice, 'talents/sarah-m'), { votes: increment(-1) })
  return assertFails(b.commit())
})
await test('refus : déplacer ses votes vers un autre talent', () => {
  const b = writeBatch(alice)
  b.set(doc(alice, 'bulletins/rap_alice'), { uid: 'alice', category: 'rap', total: 7, parts: { 'karim-s': 7 }, dernier: 'karim-s', at: new Date() })
  b.update(doc(alice, 'talents/karim-s'), { votes: increment(1) })
  return assertFails(b.commit())
})
await test('refus : « dernier » ne correspond pas au talent modifié', () => {
  const b = writeBatch(alice)
  b.set(doc(alice, 'bulletins/rap_alice'), { uid: 'alice', category: 'rap', total: 7, parts: { 'sarah-m': 7 }, dernier: 'karim-s', at: new Date() })
  b.update(doc(alice, 'talents/karim-s'), { votes: increment(1) })
  return assertFails(b.commit())
})
await test('Alice achète aussi 1 vote pour Karim (même discipline, total 7)', () => assertSucceeds(buy(alice, 'alice', 'rap', 'karim-s', 1, a6)))
await test('Alice achète 10 votes pour Maya en chant (autre plafond)', () => assertSucceeds(buy(alice, 'alice', 'chant', 'maya-l', 10)))
await test('refus : Bob écrit le bulletin d’Alice', () => assertFails(buy(bob, 'alice', 'danse', 'jade-t', 1)))
await test('refus : Bob lit le bulletin d’Alice', () => assertFails(getDoc(doc(bob, 'bulletins/rap_alice'))))
await test('Alice lit son propre bulletin', () => assertSucceeds(getDoc(doc(alice, 'bulletins/rap_alice'))))
await test('Bob consulte son bulletin de danse inexistant sans erreur', () => assertSucceeds(getDoc(doc(bob, 'bulletins/danse_bob'))))

let final = {}
await env.withSecurityRulesDisabled(async (ctx) => {
  const db = ctx.firestore()
  const g = async (id) => (await getDoc(doc(db, 'talents', id))).data()
  final = { sarah: await g('sarah-m'), karim: await g('karim-s'), maya: await g('maya-l') }
})
await test('compteurs finaux cohérents (Sarah : 1 enc. / 6 votes, Karim : 1 vote, Maya : 10 votes)', async () => {
  const ok = final.sarah.encouragements === 1 && final.sarah.votes === 6 && final.karim.votes === 1 && final.maya.votes === 10
  if (!ok) throw new Error(JSON.stringify(final))
})

await env.cleanup()
console.log(`\n${passed} réussis, ${failed} échoués\n`)
process.exit(failed ? 1 : 0)
