// Script Node.js pour générer un mapping synthétique L1→L2→L3→L4 (codes uniquement)
// Place ce fichier dans le même dossier que bc-mapping.json et bc-l4-mapping.json

const fs = require('fs');
// const caps = ... (capabilities.json supprimé)
const l4map = JSON.parse(fs.readFileSync('bc-l4-mapping.json', 'utf8'));

const hierarchy = {};

// 1. Construire la hiérarchie L1 > L2 > L3
for (const [code, obj] of Object.entries(caps)) {
  if (obj.l1_code && obj.l2_name && !obj.l3_name) {
    // C'est un L2
    const l1 = obj.l1_code;
    if (!hierarchy[l1]) hierarchy[l1] = {};
    hierarchy[l1][code] = {};
  }
}
for (const [code, obj] of Object.entries(caps)) {
  if (obj.l2_code && obj.l3_name) {
    // C'est un L3
    // Retrouver le L1 parent via le L2
    const l2 = obj.l2_code;
    const l2obj = caps[l2];
    if (!l2obj || !l2obj.l1_code) continue;
    const l1 = l2obj.l1_code;
    if (!hierarchy[l1]) hierarchy[l1] = {};
    if (!hierarchy[l1][l2]) hierarchy[l1][l2] = {};
    // L4 éventuels
    const l4s = l4map[code] || [];
    hierarchy[l1][l2][code] = l4s;
  }
}

fs.writeFileSync('bc-hierarchy-mapping.json', JSON.stringify(hierarchy, null, 2));
console.log('bc-hierarchy-mapping.json généré !');
