function fetch_sussy_baka_upgrades() {
  return [
    {
      helper_name: "Sussy Baka",
      name: "Deceptive Imposter",
      base_cost: 100,
      cost: 100,
      requirement: 1,
      action: upgrade_helper_spc,
      summary: `The mouse and Sussy Baka are <span class="info-list-highlight">twice as efficient</span>.`,
      description: "The Sussy Baka evolves into a Deceptive Imposter, mastering the art of disguise and deceit. This evolution allows them to seamlessly blend in with their surroundings, making it difficult for enemies to discern their true identity.",
      icon: "images/helpers/SussyBaka.png",
      owned: false,
      sound_path: "sound/helpers/SussyBaka/",
      sfx_quantity: 3,
      color: neonColors['Neon Pink'],
      c_filter: true,
    },
    {
      helper_name: "Sussy Baka",
      name: "Mysterious Saboteur",
      base_cost: 500,
      cost: 500,
      requirement: 1,
      action: upgrade_helper_spc,
      summary: `The mouse and Sussy Baka are <span class="info-list-highlight">twice as efficient</span>.`,
      description: "The Deceptive Imposter further evolves into a Mysterious Saboteur, specializing in sabotage and subterfuge. This evolution grants them advanced knowledge of traps, gadgets, and stealth techniques to gain the upper hand in suspicion battles.",
      icon: "images/helpers/SussyBaka.png",
      owned: false,
      sound_path: "sound/helpers/SussyBaka/",
      sfx_quantity: 3,
      color: neonColors['Atomic Orange'],
      c_filter: true,
    },
    {
      helper_name: "Sussy Baka",
      name: "Shadowy Manipulator",
      base_cost: 1e4,
      cost: 1e4,
      requirement: 10,
      action: upgrade_helper_spc,
      summary: `The mouse and Sussy Baka are <span class="info-list-highlight">twice as efficient</span>.`,
      description: "The Shadowy Manipulator is a master of manipulating shadows and manipulating the minds of foes. This evolution grants them unparalleled control over the unseen forces, making them formidable opponents with unmatched sus.",
      icon: "images/helpers/SussyBaka.png",
      owned: false,
      sound_path: "sound/helpers/SussyBaka/",
      sfx_quantity: 3,
      color: neonColors['Glowing Red'],
      c_filter: true,
    }
  ];
}

function fetch_pewdiepie_upgrades() {
  return [
    {
      helper_name: "PewDiePie",
      name: "Bridge Explorer",
      base_cost: 1000,
      cost: 1000,
      requirement: 1,
      action: upgrade_default,
      summary: `PewDiePie is <span class="info-list-highlight">twice as efficient</span>.`,
      description: "PewDiePie becomes a skilled Bridge Explorer, utilizing his experience from the infamous bridge incident. This upgrade enhances his ability to navigate and strategize near bridges, gaining advantages in bridge-related encounters.",
      icon: "images/helpers/PewDiePie.gif",
      owned: false,
      sound_path: "sound/helpers/PewDiePie/",
      sfx_quantity: 1,
      color: neonColors['Cyber Cyan'],
      c_filter: true,
    },
    {
      helper_name: "PewDiePie",
      name: "Bridge Mastery",
      base_cost: 5000,
      cost: 5000,
      requirement: 5,
      action: upgrade_default,
      summary: `PewDiePie is <span class="info-list-highlight">twice as efficient</span>.`,
      description: "The Bridge Explorer advances to Bridge Mastery, achieving a deeper understanding of bridge dynamics. He can turn the tables in bridge-related slur-saying engagements, using the terrain to his advantage.",
      icon: "images/helpers/PewDiePie.gif",
      owned: false,
      sound_path: "sound/helpers/PewDiePie/",
      sfx_quantity: 1,
      color: neonColors['Laser Green'],
      c_filter: true,
    },
    {
      helper_name: "PewDiePie",
      name: "Bridge Conqueror",
      base_cost: 5*1e5,
      cost: 5*1e5,
      requirement: 25,
      action: upgrade_default,
      summary: `PewDiePie is <span class="info-list-highlight">twice as efficient</span>.`,
      description: "The Bridge Master attains the ultimate title of Bridge Conqueror. His bridge prowess reaches its peak, and he can now shape the outcome of battles on bridges like never before. Hopefully won't require any more nefarious slurs.",
      icon: "images/helpers/PewDiePie.gif",
      owned: false,
      sound_path: "sound/helpers/PewDiePie/",
      sfx_quantity: 1,
      color: neonColors['Vivid Purple'],
      c_filter: true,
    }
  ];
}

function fetch_mrincredible_upgrades() {
  return [
    {
      helper_name: "Mr.Incredible",
      name: "find name mistah inc 1",
      base_cost: 1.2e5,
      cost: 1.2e5,
      requirement: 1,
      action: upgrade_helper_inc_img,
      summary: `Mr. Incredible is <span class="info-list-highlight">half as canny</span>.`,
      description: "Come up with description",
      icon: "images/helpers/MisterIncredible/2.jpg",
      owned: false,
      sound_path: "sound/helpers/MisterIncredible/",
      sfx_quantity: 16,
      sfx_number: 2,
      color: neonColors['Fluorescent Yellow'],
      c_filter: true,
    },
    {
      helper_name: "Mr.Incredible",
      name: "find name mistah inc 2",
      base_cost: 6e5,
      cost: 6e5,
      requirement: 5,
      action: upgrade_helper_inc_img,
      summary: `Mr. Incredible is <span class="info-list-highlight">half as canny</span>.`,
      description: "Come up with description",
      icon: "images/helpers/MisterIncredible/3.jpg",
      owned: false,
      sound_path: "sound/helpers/MisterIncredible/",
      sfx_quantity: 16,
      sfx_number: 3,
      color: neonColors['Hot Magenta'],
      c_filter: true,
    },
    {
      helper_name: "Mr.Incredible",
      name: "find name mistah inc 3",
      base_cost: 6e6,
      cost: 6e6,
      requirement: 25,
      action: upgrade_helper_inc_img,
      summary: `Mr. Incredible is <span class="info-list-highlight">half as canny</span>.`,
      description: "Come up with description",
      icon: "images/helpers/MisterIncredible/4.jpg",
      owned: false,
      sound_path: "sound/helpers/MisterIncredible/",
      sfx_quantity: 16,
      sfx_number: 4,
      color: neonColors['Cyber Cyan'],
      c_filter: true,
    }
  ];
}

function fetch_all_upgrades() {
  return [
    fetch_sussy_baka_upgrades(),
    fetch_pewdiepie_upgrades(),
    // fetch someone else brah
    fetch_mrincredible_upgrades(),
  ]
}

/* Upgrade function definitions (some are special/different) */

// NEON COLORS
const neonColors = {
  'Electric Blue': '#00ccff',
  'Laser Green': '#00ff66',
  'Neon Pink': '#ff33cc',
  'Atomic Orange': '#ff9900',
  'Vivid Purple': '#cc00ff',
  'Fluorescent Yellow': '#ffff00',
  'Hot Magenta': '#ff0099',
  'Cyber Cyan': '#00ffff',
  'Glowing Red': '#ff0000',
  'Luminous Lime': '#ccff00'
};

/* definition of upgrade functions */
function upgrade_default(upgrade) {
  const helper = helpers.find(helper => helper.name === upgrade.helper_name);
  helper.sps *= 2;
}

function upgrade_helper_spc(upgrade) {
  // const helper = helpers.find(helper => helper.name === upgrade.helper_name);
  // helper.sps *= 2;
  upgrade_default(upgrade);
  sus_per_click *= 2;
}

function upgrade_sussy_baka_type2() {
  // todo
}

function upgrade_helper_inc_img(upgrade) {
  // repeating this code here since I have to then find the helper anyways
  const helper = helpers.find(helper => helper.name === upgrade.helper_name);
  helper.sps *= 2;

  const incrementImageNumber = (imagePath) => {
    const regex = /(\d+)(?=\.\w+$)/;
    const match = imagePath.match(regex);
  
    if (match) {
      const currentNumber = parseInt(match[0], 10);
      const newNumber = currentNumber + 1;
      return imagePath.replace(regex, newNumber.toString());
    }
  
    return imagePath;
  };

  helper.icon = incrementImageNumber(helper.icon);
  helper.sfx_number = 
    helper.sfx_number + 1 > helper.sfx_quantity ? helper.sfx_quantity
    : helper.sfx_number + 1;
}
