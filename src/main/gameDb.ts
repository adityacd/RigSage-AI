/**
 * Maps Windows process names (lowercased, including .exe) to display game names.
 *
 * To add a game: open Task Manager while the game is running, find the process
 * name under the Details tab, then add it here in lowercase.
 */
export const GAME_DB: Record<string, string> = {
  // --- FPS / Tactical Shooters ---
  'cs2.exe':                              'Counter-Strike 2',
  'csgo.exe':                             'CS:GO',
  'valorant.exe':                         'VALORANT',
  'r5apex.exe':                           'Apex Legends',
  'rainbowsix.exe':                       'Rainbow Six Siege',
  'modernwarfare2.exe':                   'Call of Duty: MW2',
  'warzone.exe':                          'Call of Duty: Warzone',
  'blackopscoldwar.exe':                  'Call of Duty: Black Ops Cold War',
  'overwatch.exe':                        'Overwatch 2',
  'destiny2.exe':                         'Destiny 2',
  'escapefromtarkov.exe':                 'Escape from Tarkov',
  'hunt.exe':                             'Hunt: Showdown',
  'titanfall2.exe':                       'Titanfall 2',
  'payday3.exe':                          'PAYDAY 3',
  'payday2.exe':                          'PAYDAY 2',
  'back4blood.exe':                       'Back 4 Blood',
  'l4d2.exe':                             'Left 4 Dead 2',

  // --- Battle Royale ---
  'fortniteclient-win64-shipping.exe':    'Fortnite',
  'tslgame.exe':                          'PUBG: Battlegrounds',

  // --- Battlefield Series ---
  'battlefield2042.exe':                  'Battlefield 2042',
  'bfv.exe':                              'Battlefield V',
  'bf1.exe':                              'Battlefield 1',
  'bf4.exe':                              'Battlefield 4',

  // --- MOBAs ---
  'league of legends.exe':               'League of Legends',
  'dota2.exe':                            'Dota 2',

  // --- Open World / RPG ---
  'cyberpunk2077.exe':                    'Cyberpunk 2077',
  'witcher3.exe':                         'The Witcher 3',
  'rdr2.exe':                             'Red Dead Redemption 2',
  'gta5.exe':                             'Grand Theft Auto V',
  'eldenring.exe':                        'Elden Ring',
  'sekiro.exe':                           'Sekiro',
  'darksoulsiii.exe':                     'Dark Souls III',
  'darksoulsremastered.exe':              'Dark Souls Remastered',
  'bg3.exe':                              "Baldur's Gate 3",
  'bg3_dx11.exe':                         "Baldur's Gate 3",
  'hogwartslegacy.exe':                   'Hogwarts Legacy',
  'starfield.exe':                        'Starfield',
  'skyrimse.exe':                         'Skyrim Special Edition',
  'fallout4.exe':                         'Fallout 4',
  'fallout76.exe':                        'Fallout 76',
  'dragonageinquisition.exe':             'Dragon Age: Inquisition',
  'masseffectlegendaryedition.exe':       'Mass Effect Legendary Edition',
  'nierautomata.exe':                     'NieR: Automata',
  'p5r.exe':                              'Persona 5 Royal',

  // --- Action / Adventure ---
  'godofwar.exe':                         'God of War',
  'spiderman.exe':                        "Marvel's Spider-Man Remastered",
  'spiderman2.exe':                       "Marvel's Spider-Man 2",
  'returnal.exe':                         'Returnal',
  'thelastofuspart1.exe':                 'The Last of Us Part I',
  'horizonzerodawn.exe':                  'Horizon Zero Dawn',
  'horizonforbiddenwest.exe':             'Horizon Forbidden West',
  'deathstranding.exe':                   'Death Stranding',
  'acorigins.exe':                        "Assassin's Creed Origins",
  'acodyssey.exe':                        "Assassin's Creed Odyssey",
  'acvalhalla.exe':                       "Assassin's Creed Valhalla",
  'acmirage.exe':                         "Assassin's Creed Mirage",

  // --- Strategy ---
  'civilizationvi.exe':                   'Civilization VI',
  'warhammer3.exe':                       'Total War: Warhammer III',
  'xcom2.exe':                            'XCOM 2',
  'frostpunk2.exe':                       'Frostpunk 2',

  // --- Sports / Racing ---
  'forzahorizon5.exe':                    'Forza Horizon 5',
  'forzamotorsport.exe':                  'Forza Motorsport',
  'fc24.exe':                             'EA Sports FC 24',
  'fc25.exe':                             'EA Sports FC 25',

  // --- Survival / Sandbox ---
  'minecraft.exe':                        'Minecraft',
  'valheim.exe':                          'Valheim',
  'rust.exe':                             'Rust',
  'dayz.exe':                             'DayZ',
  'subnautica.exe':                       'Subnautica',
  'terraria.exe':                         'Terraria',
  'stardewvalley.exe':                    'Stardew Valley',
  'factorygame-win64-shipping.exe':       'Satisfactory',
  'nms.exe':                              "No Man's Sky",
  'astroneer.exe':                        'ASTRONEER',
  'palworld.exe':                         'Palworld',
  'helldivers2.exe':                      'Helldivers 2',
  'fsd.exe':                              'Deep Rock Galactic',
  '7daystodie.exe':                       '7 Days to Die',

  // --- Indie / Roguelikes ---
  'hades.exe':                            'Hades',
  'hades2.exe':                           'Hades II',
  'hollowknight.exe':                     'Hollow Knight',
  'celeste.exe':                          'Celeste',
  'cupheadwindows.exe':                   'Cuphead',

  // --- MMOs / Live Service ---
  'ffxiv_dx11.exe':                       'Final Fantasy XIV',
  'worldofwarcraft.exe':                  'World of Warcraft',
  'pathofexile.exe':                      'Path of Exile',
  'pathofexile2.exe':                     'Path of Exile 2',
  'warframe.x64.exe':                     'Warframe',
  'genshinimpact.exe':                    'Genshin Impact',
  'yuanshen.exe':                         'Genshin Impact',
  'starrail.exe':                         'Honkai: Star Rail',
  'hearthstone.exe':                      'Hearthstone',

  // --- Fighting ---
  'tekken8.exe':                          'Tekken 8',
  'streetfighter6.exe':                   'Street Fighter 6',
  'mk12.exe':                             'Mortal Kombat 1',

  // --- Simulation ---
  'flightsimulator.exe':                  'Microsoft Flight Simulator',
  'eurotruck2.exe':                       'Euro Truck Simulator 2',
}
