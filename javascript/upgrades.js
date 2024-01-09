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

function fetch_sussy_baka_upgrades() {
    return [
      {
        helper_name: "Sussy Baka",
        name: "Deceptive Imposter",
        base_cost: 100,
        cost: 100,
        requirement: 1,
        upgrade: "normal",
        description: "The Sussy Baka evolves into a Deceptive Imposter, mastering the art of disguise and deceit. This evolution allows them to seamlessly blend in with their surroundings, making it difficult for enemies to discern their true identity.",
        icon: "images/helpers/SussyBaka.png",
        owned: false,
        sound_path: "sound/helpers/SussyBaka/",
        sfx_quantity: 3,
        color: neonColors['Neon Pink'],
      },
      {
        helper_name: "Sussy Baka",
        name: "Mysterious Saboteur",
        base_cost: 500,
        cost: 500,
        requirement: 1,
        upgrade: "normal",
        description: "The Deceptive Imposter further evolves into a Mysterious Saboteur, specializing in sabotage and subterfuge. This evolution grants them advanced knowledge of traps, gadgets, and stealth techniques to gain the upper hand in suspicion battles.",
        icon: "images/helpers/SussyBaka.png",
        owned: false,
        sound_path: "sound/helpers/SussyBaka/",
        sfx_quantity: 3,
        color: neonColors['Atomic Orange'],
      },
      {
        helper_name: "Sussy Baka",
        name: "Shadowy Manipulator",
        base_cost: 1e4,
        cost: 1e4,
        requirement: 10,
        upgrade: "normal",
        description: "The Shadowy Manipulator is a master of manipulating shadows and manipulating the minds of foes. This evolution grants them unparalleled control over the unseen forces, making them formidable opponents with unmatched sus.",
        icon: "images/helpers/SussyBaka.png",
        owned: false,
        sound_path: "sound/helpers/SussyBaka/",
        sfx_quantity: 3,
        color: neonColors['Glowing Red'],
      }
    ];
}

function fetch_pewdiepie_upgrades() {
    // these aren't implemented yet but I needed to test the display function
    return [
      {
        helper_name: "PewDiePie",
        name: "Deceptive Imposter",
        base_cost: 100,
        cost: 100,
        requirement: 1,
        upgrade: "normal",
        description: "The Sussy Baka evolves into a Deceptive Imposter, mastering the art of disguise and deceit. This evolution allows them to seamlessly blend in with their surroundings, making it difficult for enemies to discern their true identity.",
        icon: "images/helpers/SussyBaka.png",
        owned: false,
        sound_path: "sound/helpers/SussyBaka/",
        sfx_quantity: 3,
        color: neonColors['Neon Pink'],
      },
      {
        helper_name: "PewDiePie",
        name: "Mysterious Saboteur",
        base_cost: 500,
        cost: 500,
        requirement: 1,
        upgrade: "normal",
        description: "The Deceptive Imposter further evolves into a Mysterious Saboteur, specializing in sabotage and subterfuge. This evolution grants them advanced knowledge of traps, gadgets, and stealth techniques to gain the upper hand in suspicion battles.",
        icon: "images/helpers/SussyBaka.png",
        owned: false,
        sound_path: "sound/helpers/SussyBaka/",
        sfx_quantity: 3,
        color: neonColors['Atomic Orange'],
      },
      {
        helper_name: "PewDiePie",
        name: "Shadowy Manipulator",
        base_cost: 1e4,
        cost: 1e4,
        requirement: 10,
        upgrade: "normal",
        description: "The Shadowy Manipulator is a master of manipulating shadows and manipulating the minds of foes. This evolution grants them unparalleled control over the unseen forces, making them formidable opponents with unmatched sus.",
        icon: "images/helpers/SussyBaka.png",
        owned: false,
        sound_path: "sound/helpers/SussyBaka/",
        sfx_quantity: 3,
        color: neonColors['Glowing Red'],
      }
    ];
}

function fetch_all_upgrades() {
    return [
        fetch_sussy_baka_upgrades(),
        fetch_pewdiepie_upgrades(),
    ]
}
