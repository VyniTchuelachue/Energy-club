// Données du club : c'est ici qu'on modifie les horaires et le planning.
window.EC_DATA = {
  phone: "237699904901",
  email: "energyclubcameroun@yahoo.fr",

  // Ouverture par jour (0 = dimanche), en minutes depuis minuit : [ouverture, fermeture].
  hours: {
    1: [420, 1290],
    2: [420, 1290],
    3: [420, 1290],
    4: [420, 1290],
    5: [420, 1290],
    6: [420, 1200],
    0: [480, 960]
  },

  // Planning des cours. EXEMPLE À REMPLACER par le planning réel du club.
  // Chaque séance : [heure, cours, lieu, type]
  //   lieu : "s1" (salle 1), "s2" (salle 2), "pool" (piscine), "dojo"
  //   type : "cours", "aqua" ou "combat" (couleur du repère)
  planning: {
    1: [
      ["07:30", "Body sculpt", "s1", "cours"],
      ["09:00", "Aquagym", "pool", "aqua"],
      ["12:30", "Step", "s1", "cours"],
      ["18:00", "Afro-gym", "s1", "cours"],
      ["18:30", "Judo", "dojo", "combat"],
      ["19:00", "Cross training", "s2", "cours"],
      ["19:30", "Aquabike", "pool", "aqua"]
    ],
    2: [
      ["07:30", "Pilates", "s2", "cours"],
      ["10:00", "Aquagym", "pool", "aqua"],
      ["12:30", "Body pump", "s1", "cours"],
      ["18:00", "Zumba", "s1", "cours"],
      ["18:30", "Cardio kick-boxing", "s2", "combat"],
      ["19:30", "Bike", "s2", "cours"]
    ],
    3: [
      ["07:30", "Step", "s1", "cours"],
      ["09:00", "Aquabike", "pool", "aqua"],
      ["12:30", "Yoga", "s2", "cours"],
      ["18:00", "Afro-gym", "s1", "cours"],
      ["18:30", "Judo", "dojo", "combat"],
      ["19:00", "Tae bo", "s2", "cours"],
      ["19:30", "Aquagym", "pool", "aqua"]
    ],
    4: [
      ["07:30", "Body sculpt", "s1", "cours"],
      ["10:00", "Aquagym", "pool", "aqua"],
      ["12:30", "Cross training", "s2", "cours"],
      ["18:00", "Zumba", "s1", "cours"],
      ["18:30", "Capoeira", "dojo", "combat"],
      ["19:30", "Body pump", "s1", "cours"]
    ],
    5: [
      ["07:30", "Pilates", "s2", "cours"],
      ["09:00", "Aquabike", "pool", "aqua"],
      ["12:30", "Step", "s1", "cours"],
      ["18:00", "Afro-gym", "s1", "cours"],
      ["18:30", "Cardio kick-boxing", "s2", "combat"],
      ["19:30", "Bike", "s2", "cours"]
    ],
    6: [
      ["08:00", "Cross training", "s2", "cours"],
      ["09:00", "Aquagym", "pool", "aqua"],
      ["10:00", "Zumba", "s1", "cours"],
      ["11:00", "Judo", "dojo", "combat"],
      ["16:00", "Afro-gym", "s1", "cours"]
    ],
    0: [
      ["09:00", "Yoga", "s2", "cours"],
      ["10:00", "Aquagym", "pool", "aqua"],
      ["11:00", "Zumba", "s1", "cours"]
    ]
  }
};
