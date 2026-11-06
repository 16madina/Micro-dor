/**
 * Tests des règles de sécurité Firestore (encouragements, votes, profils).
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
const ghost = env.authenticatedContext('ghost', { email: 'ghost@exemple.ca', firebase: { sign_in_provider: 'password' } }).firestore()
const visitor = env.unauthenticatedContext().firestore()

await env.withSecurityRulesDisabled(async (ctx) => {
  const db = ctx.firestore()
  await setDoc(doc(db, 'users/alice'), { role: 'eleve', email: 'alice@exemple.ca' })
  await setDoc(doc(db, 'users/bob'), { role: 'parent', email: 'bob@exemple.ca' })
})

const encourage = (db, uid, tid, add = true) => {
  const b = writeBatch(db)
  const fan = doc(db, 'talents', tid, 'fans', uid)
  if (add) b.set(fan, { at: new Date() })
  else b.delete(fan)
  b.update(doc(db, 'talents', tid), { encouragements: increment(add ? 1 : -1) })
  return b.commit()
}
const vote = (db, uid, cat, tid, prev) => {
  const b = writeBatch(db)
  b.set(doc(db, 'votes', `${cat}_${uid}`), { uid, category: cat, talentId: tid, at: new Date() })
  b.update(doc(db, 'talents', tid), { votes: increment(1) })
  if (prev) b.update(doc(db, 'talents', prev), { votes: increment(-1) })
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

console.log('\nVoter')
await test('refus : un visiteur anonyme ne peut pas voter', () => assertFails(vote(anon, 'anon1', 'rap', 'sarah-m')))
await test('refus : compte sans profil MICRO D’OR', () => assertFails(vote(ghost, 'ghost', 'rap', 'sarah-m')))
await test('Alice vote pour Sarah en rap', () => assertSucceeds(vote(alice, 'alice', 'rap', 'sarah-m')))
await test('refus : Alice revote pour Sarah (même voix)', () => assertFails(vote(alice, 'alice', 'rap', 'sarah-m')))
await test('refus : deuxième voix en rap sans retirer la première', () => assertFails(vote(alice, 'alice', 'rap', 'karim-s')))
await test('Alice déplace sa voix de Sarah vers Karim', () => assertSucceeds(vote(alice, 'alice', 'rap', 'karim-s', 'sarah-m')))
await test('Alice vote aussi en chant (autre discipline)', () => assertSucceeds(vote(alice, 'alice', 'chant', 'maya-l')))
await test('refus : voter pour un talent d’une autre discipline', () => assertFails(vote(alice, 'alice', 'chant', 'jade-t', 'maya-l')))
await test('refus : +1 vote sans bulletin', () => assertFails(writeBatch(bob).update(doc(bob, 'talents/jade-t'), { votes: increment(1) }).commit()))
await test('refus : Bob écrit le bulletin d’Alice', () => assertFails(vote(bob, 'alice', 'danse', 'jade-t')))
await test('refus : Bob lit le bulletin d’Alice', () => assertFails(getDoc(doc(bob, 'votes/rap_alice'))))
await test('Alice lit son propre bulletin', () => assertSucceeds(getDoc(doc(alice, 'votes/rap_alice'))))
await test('Bob consulte son bulletin de danse inexistant sans erreur', () => assertSucceeds(getDoc(doc(bob, 'votes/danse_bob'))))

let final = {}
await env.withSecurityRulesDisabled(async (ctx) => {
  const db = ctx.firestore()
  const g = async (id) => (await getDoc(doc(db, 'talents', id))).data()
  final = { sarah: await g('sarah-m'), karim: await g('karim-s'), maya: await g('maya-l') }
})
await test('compteurs finaux cohérents (Sarah : 1 enc. / 0 vote, Karim : 1 vote, Maya : 1 vote)', async () => {
  const ok = final.sarah.encouragements === 1 && final.sarah.votes === 0 && final.karim.votes === 1 && final.maya.votes === 1
  if (!ok) throw new Error(JSON.stringify(final))
})

await env.cleanup()
console.log(`\n${passed} réussis, ${failed} échoués\n`)
process.exit(failed ? 1 : 0)
