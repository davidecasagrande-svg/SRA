// Slope Description Record v4 — form schema, scoring and PDF stamping onto the original 9-page template.
(function () {
const CB = [["B.aboveSoil",1,242.5,307.8,"Soil"],["B.aboveRock",1,294.5,307.8,"Rock"],["B.belowSoil",1,242.5,253,"Soil"],["B.belowRock",1,294.5,253,"Rock"],["D.none",1,42.5,123.9,"None"],["D.notKnown",1,127.6,123.9,"Not known"],["D.soil",1,42.5,111.3,"Soil"],["D.rock",1,127.6,111.3,"Rock"],["D.composite",1,191.4,111.3,"Composite"],["D.fall",1,42.5,78.8,"Fall"],["D.topple",1,127.6,78.8,"Topple"],["D.slide",1,191.4,78.8,"Slide"],["D.rotational",1,254.5,78.8,"Rotational"],["D.translational",1,42.5,66.1,"Translational"],["D.spread",1,127.6,66.1,"Spread"],["D.flow",1,191.4,66.1,"Flow"],["D.complex",1,255.2,66.1,"Complex"],["D.debris",1,42.5,53.5,"Debris flow/avalanche"],["D.other",1,191.4,53.5,"Other (describe briefly):"],["E1.rTension",4,42.5,746.1,"Tension Cracks"],["E1.rLoose",4,186.1,746.1,"Loose Blocks"],["E1.rOverhang",4,42.5,734.1,"Overhangs"],["E1.rErodible",4,186.5,734.1,"Erodible seams/beds"],["E1.rSheared",4,42.5,721.9,"Sheared/fracture zones"],["E1.rVeg",4,186.5,721.9,"Vegetation in defects"],["E1.rSpalling",4,42.5,709.9,"Spalling"],["E1.rNewExc",4,186.5,709.9,"New excavation/fill"],["E1.rMany",4,42.5,685.2,"Many"],["E1.rSome",4,114.5,685.2,"Some"],["E1.rNone",4,186.5,685.2,"None"],["E1.sTension",4,42.5,615.6,"Tension Cracks"],["E1.sToeHeave",4,192.5,615.6,"Toe heave"],["E1.sBulging",4,42.5,603.5,"Bulging"],["E1.sHummocky",4,192.5,603.5,"Hummocky ground"],["E1.sDeform",4,42.5,591.4,"Surface deformation"],["E1.sDamage",4,192.5,591.4,"Damage to structures"],["E1.sErosion",4,42.5,579.4,"Erosion at toe of slope"],["E1.sNewExc",4,193.3,579.4,"New excavation/fill"],["E1.sMajor",4,42.5,554.7,"Major"],["E1.sMinor",4,114.5,554.7,"Minor"],["E1.sNone",4,192.4,554.7,"None"],["E2.planes",4,42.5,464.5,"Planes"],["E2.wedges",4,119.1,464.5,"Wedges"],["E2.topple",4,192.5,464.5,"Potential Toppling"],["E2.tight",4,42.5,452.4,"Tight/clean"],["E2.open",4,117.9,452.4,"Open/weathered/infilled"],["E2.many",4,42.5,427.6,"Many"],["E2.some",4,120.5,427.6,"Some"],["E2.none",4,192.4,427.6,"None"],["F.above",4,42.5,284.8,"Above Batter Slope"],["F.lined",4,162.8,284.8,"lined"],["F.benches",4,219.7,284.8,"On benches"],["F.none",4,303.4,284.8,"None"],["F.unlined",4,162.2,272.7,"unlined"],["F.toe",4,42.5,260.7,"At toe of batter slope"],["F.pavement",4,42.5,248.6,"Pavement/median stormwater separated from cross drainage"],["F.pToe",4,42.5,205.8,"At toe of batter"],["F.pMedian",4,141.8,205.8,"Along median"],["F.pTrans",4,222.5,205.8,"Transverse"],["F.cSep",4,42.5,178.1,"Separation of Joints"],["F.cMisalign",4,156.4,178.1,"Misalignment"],["F.cCrack",4,42.5,166,"Cracking"],["F.cDeformed",4,156.4,166,"Deformed Pipes"],["F.cErosion",4,252.7,166,"Erosion of Backfill"],["F.sPavement",4,42.5,138.3,"Pavement drainage"],["F.sHoriz",4,157.5,138.3,"Horizontal drains"],["F.sSubsoil",4,251.4,138.3,"Subsoil Drains"],["F.wRetaining",4,42.5,111.1,"Retaining structures"],["F.wShotcrete",4,163,111.1,"Shotcrete"],["F.wDrainage",4,42.5,99.1,"Drainage system behind retaining structures"],["F.wGeotextile",4,42.5,87,"Geotextile composite drains under shotcrete"],["G.mains",5,42.5,732.3,"Water Mains"],["G.domestic",5,186.5,732.3,"Domestic Water Supply"],["G.sewer",5,42.5,720.1,"Sewer pipes"],["G.storm",5,186.5,720.1,"Stormwater drains"],["G.irrigation",5,42.5,708,"Irrigation"],["G.dam",5,186.5,708,"Farm dam"],["G.other",5,42.5,696,"Other"],["G.none",5,186.5,696,"None"],["G.visible",5,42.5,671.2,"Visible or marked"],["G.plans",5,186.5,671.2,"From plans or search"],["G.inferred",5,42.5,659.2,"Inferred"],["H.pondGround",5,42.5,613.6,"Ponding on ground surface"],["H.tension",5,222.5,613.6,"Tension cracks"],["H.openJoints",5,42.5,601.6,"Open joints"],["H.pondDrains",5,222.5,601.6,"Ponding in open drains"],["H.culverts",5,42.5,589.5,"Blocked or damaged culverts"],["H.leakage",5,222.5,589.5,"Leakage from services"],["H.discharge",5,42.5,577.4,"Surface drainage discharged on slope"],["H.subsurface",5,42.5,565.3,"Blocked or damaged subsurface drainage"],["H.entering",5,42.5,553.3,"Surface water entering sub-surface drainage"],["H.impounded",5,42.5,541.2,"Impounded water above slope or against slope"],["H.vDense",5,134.7,529.1,"Dense"],["H.vSparse",5,198.5,529.1,"Sparse"],["H.vNone",5,258.5,529.1,"None"],["H.noAdverse",5,42.5,505,"No adverse condition"],["I.weep",5,42.5,459.4,"Weepholes"],["I.horiz",5,134.7,459.4,"Horizontal drains"],["I.subsoil",5,233.9,459.4,"Subsoil Drains"],["I.surface",5,42.5,431.7,"Slope surface (soil slopes)"],["I.bedding",5,210.5,431.7,"Bedding surface"],["I.joints",5,42.5,419.7,"Joints"],["I.sheared",5,210.5,419.7,"Sheared/fractured zones"],["I.retaining",5,42.5,407.6,"Retaining structure surface"],["I.shotcrete",5,209.9,407.6,"Cracks in shotcrete"],["I.line",5,42.5,395.5,"Distinct seepage line"],["I.isolated",5,210.1,395.5,"Isolated seepage"],["I.none",5,42.5,355.2,"None"],["I.clear",5,42.5,317.8,"Clear"],["I.muddy",5,114.5,317.8,"Muddy/cloudy"],["I.clogged",5,215,317.8,"Clogged"],["I.slight",5,42.5,290.1,"Slight"],["I.moderate",5,114.5,290.1,"Moderate"],["I.high",5,215.8,290.1,"High"],["I.veryHigh",5,42.5,277.9,"Very high"],["I.continuous",5,114.5,277.9,"Continuous"],["I.intermittent",5,215.8,277.9,"Intermittent"],["I.newPoints",5,42.5,238.2,"New seepage points"],["I.newSources",5,186.5,238.2,"New sources of infiltration"],["I.increase",5,42.5,226.1,"Increase in volume"],["I.cessation",5,186.5,226.1,"Cessation of previous seepage"],["I.decrease",5,42.5,214,"Decrease in volume"],["I.condChanged",5,186.5,214,"Water condition changed"],["I.noChange",5,42.5,201.9,"No observed change"],["I.noPrevious",5,186.5,201.9,"No previous observations"],["J.shotcrete",6,42.5,648.6,"Shotcrete"],["J.bolts",6,162.5,648.6,"Rock Bolts"],["J.fences",6,42.5,636.6,"Fences/barriers"],["J.anchors",6,162.5,636.6,"Anchors"],["J.nails",6,42.5,624.4,"Soil Nails"],["J.mesh",6,162.5,624.4,"Mesh (rigid or flexible)"],["J.dowels",6,42.5,612.4,"Dowels"],["J.signs",6,162.5,612.4,"Signs"],["J.access",6,42.5,600.3,"Access restrictions"],["J.monitoring",6,162.5,600.3,"Monitoring"],["J.other",6,42.5,588.3,"Other (describe):"],["J.iObs",6,42.5,549,"Observation"],["J.iSearch",6,162.5,549,"Search"],["J.iAnecdotal",6,42.5,537,"Anecdotal"],["J.iInferred",6,162.5,537,"Inferred"],["J.iOther",6,42.5,524.8,"Other:"],["J.good",6,42.5,483.6,"All in generally good condition"],["J.na",6,222.5,483.6,"N/A – None present"],["J.rCrack",6,42.5,455.4,"Cracking"],["J.rBulge",6,120.5,455.4,"Bulging"],["J.rTilt",6,198.5,455.4,"Tilting"],["J.rSlide",6,42.5,442.7,"Sliding"],["J.rSettle",6,120.5,442.7,"Settlement"],["J.rSeepFace",6,198.5,442.7,"Seepage through face"],["J.rSeepToe",6,42.5,430,"Seepage at or below toe"],["J.rCorrosion",6,198.5,430,"Corrosion/acid attack"],["J.sCrack",6,42.5,401.8,"Cracking"],["J.sToeSeep",6,200,401.8,"Toe seepage"],["J.sSeepCracks",6,42.5,389.1,"Seepage through cracks"],["J.sCorrosion",6,199.1,389.1,"Corrosion/acid attack"],["J.sDisplace",6,42.5,376.5,"Displacement"],["J.aCorrosion",6,42.5,348.1,"Corrosion"],["J.aBond",6,198.5,348.1,"Loss of bond"],["J.aTension",6,42.5,335.5,"Loss of tension"],["J.mAnchorage",6,42.5,307.2,"Anchorage failure"],["J.mCorrosion",6,198.5,307.2,"Corrosion"],["J.mDamage",6,42.5,294.6,"Damage from moving debris"],["J.mDebris",6,42.5,281.9,"Accumulation of debris"],["K.residential",7,42.5,730.3,"Residential"],["K.industrial",7,156.5,730.3,"Industrial/Commercial"],["K.open",7,42.5,717.5,"Open Space"],["K.park",7,42.5,704.8,"National Park /Wildlife Reserve Drainage/Water Storage"],["L1.removeBlocks",8,42.5,729,"Remove selected blocks"],["L1.regrade",8,198.5,729,"Regrade slope"],["L1.widen",8,312.5,729,"widen"],["L1.realign",8,396.5,729,"Realign"],["L1.bench",8,312.5,716.3,"bench"],["L1.flatten",8,312.5,703.6,"flatten"],["L1.scaleLocal",8,42.5,678.4,"Local"],["L1.scaleExt",8,114.5,678.4,"Extensive"],["L1.removeVeg",8,198.5,678.4,"Remove vegetation"],["L1.meshDraped",8,42.5,650.1,"Draped (chain-mesh)"],["L1.meshRigid",8,198.5,650.1,"Rigid"],["L1.scStruct",8,42.5,621.7,"Structural"],["L1.scSurface",8,198.5,621.7,"Surface protection"],["L1.soilNails",8,402.5,621.7,"Soil nails"],["L1.rockBolts",8,42.5,593.5,"Rock bolts"],["L1.dowels",8,198.5,593.5,"Dowels"],["L1.rockAnchors",8,402.5,593.5,"Rock anchors"],["L1.concBarrier",8,42.5,565.2,"Concrete barrier"],["L1.otherBarrier",8,198.5,565.2,"Other barrier"],["L1.fence",8,402.5,565.2,"Fence"],["L1.retaining",8,42.5,552.5,"Retaining structure"],["L1.possibleTypes",8,198.5,552.5,"Possible types:"],["L1.dSurface",8,42.5,524.2,"Surface"],["L1.dShoulder",8,99.2,524.2,"shoulder"],["L1.dHoriz",8,198.5,524.2,"Horizontal"],["L1.dSubsoil",8,402.5,524.2,"Subsoil"],["L1.dBatter",8,99.2,511.6,"batter"],["L1.dToe",8,99.2,498.9,"toe"],["L1.dTrench",8,42.5,486.3,"Trench"],["L1.dWells",8,198.5,486.3,"Wells/well points"],["L1.dBlanket",8,402.5,486.3,"Blanket"],["L1.dClear",8,42.5,473.6,"Clear/repair existing drainage"],["L1.definable",8,42.5,445.3,"Definable from a more detailed inspection"],["L1.investigate",8,294.5,445.3,"To require investigation and design"],["L2.flatten",8,42.5,387.1,"Flatten batter"],["L2.toeBerm",8,150.5,387.1,"Toe berm"],["L2.widen",8,294.5,387.1,"Widen"],["L2.toeWall",8,42.5,374.4,"Toe wall"],["L2.otherSupport",8,150.5,374.4,"Other Support"],["L2.remove",8,294.5,374.4,"Remove/reconstruct"],["L2.sealCracks",8,42.5,346.2,"Seal tension cracks"],["L2.sealShoulder",8,216.5,346.2,"Seal/improve shoulder"],["L2.culvert",8,372.5,346.2,"Extend/improve culvert or pipe"],["L2.surfaceToe",8,42.5,320.8,"Improve surface drainage at toe"],["L2.horiz",8,258.5,320.8,"Horizontal drains"],["L2.trench",8,372.5,320.8,"Trench drains"],["L2.clear",8,42.5,308.2,"Clear/repair existing drainage structures"],["L2.verify",8,258.5,308.2,"Verify capacity of culvert(s)–hydraulic analysis"],["L2.definable",8,42.5,279.9,"Definable from a more detailed inspection"],["L2.investigate",8,294.5,279.9,"To require investigation and design"],["L3.specific",8,42.5,221.7,"Specific"],["L3.general",8,42.5,180,"General"],["L3.instExisting",8,42.5,121.9,"Existing instrumentation"],["L3.instProposed",8,42.5,109.2,"Proposed instrumentation"],["L3.routine",9,42.5,729,"Routine (casual/intermittent). Specify frequency:"],["L3.rainfall",9,42.5,713.3,"During/after prolonged or heavy rainfall periods, or significant rainfall events (eg, 10yr/20yr ARI)."],["L3.defined",9,42.5,685,"Defined interval. Specify frequency:"],["L3.rMaint",9,42.5,656.7,"Maintenance Personnel"],["L3.rEng",9,42.5,641.1,"Maintenance or Engineering Professional"],["L3.rGeo",9,42.5,625.4,"Geotechnical Personnel"],["L3.mSigns",9,42.5,597.1,"Signs"],["L3.mBarriers",9,42.5,581.5,"Temporary barriers"],["L3.mLane",9,42.5,565.8,"Lane closure"],["L3.mRMP",9,42.5,550.2,"Risk Management Plan (ARL1, ARL2 & ARL3)"]];
const CBI = {}; CB.forEach(c => { CBI[c[0]] = c; });
const LBL = { 'L3.routine': 'Routine (casual/intermittent)', 'L3.rainfall': 'During/after prolonged or heavy rainfall, or significant rainfall events (eg 10yr/20yr ARI)', 'L3.defined': 'Defined interval', 'K.park': 'National Park / Wildlife Reserve / Drainage / Water Storage Catchment', 'D.other': 'Other (describe briefly)', 'J.other': 'Other (describe)', 'J.iOther': 'Other', 'L1.possibleTypes': 'Possible types', 'L2.culvert': 'Extend/improve culvert or pipe outlets on batter', 'I.clogged': 'Clogged (eg organic growth)', 'I.subsurface': 'Blocked or damaged subsurface drainage (observed or inferred)', 'H.subsurface': 'Blocked or damaged subsurface drainage (observed or inferred)' };
const label = id => LBL[id] || CBI[id]?.[4] || id;
const RADIO = [['B.aboveSoil','B.aboveRock'],['B.belowSoil','B.belowRock'],['E1.rMany','E1.rSome','E1.rNone'],['E1.sMajor','E1.sMinor','E1.sNone'],['E2.many','E2.some','E2.none'],['F.lined','F.unlined'],['H.vDense','H.vSparse','H.vNone'],['I.slight','I.moderate','I.high','I.veryHigh'],['I.continuous','I.intermittent']];
const radioOf = id => RADIO.find(g => g.includes(id));
const R = (a, b) => CB.slice(CB.findIndex(c => c[0] === a), CB.findIndex(c => c[0] === b) + 1).map(c => c[0]);

const KROWS = [
  ['domestic','Regularly occupied · Domestic/residential',622.6,'occ'],['commercial','Regularly occupied · Commercial/residential',611.1,'occ'],['educational','Regularly occupied · Educational',599.6,'occ'],['offices','Regularly occupied · Offices',588.1,'occ'],['industrial','Regularly occupied · Industrial',576.6,'occ'],['occOther','Regularly occupied · Other',565.1,'occ',[100,108]],
  ['storage','Normally unoccupied · Storage',538.9,'unocc'],['autoInfra','Normally unoccupied · Automatic infrastructure facilities',527.4,'unocc'],['abandoned','Normally unoccupied · Abandoned',504.4,'unocc'],['unoccOther','Normally unoccupied · Other (describe)',492.9,'unocc',[146,62]],
  ['roads','Roads',465.7,'road'],['railways','Railways',449.3,'rail'],
  ['powerMains','Power · Mains',422.2,'svc'],['powerLocal','Power · Local',410.7,'svc'],['powerAbove','Power · Above ground (poles, towers)',399.2,'pole'],['powerUnder','Power · Underground',376.2,'svc'],
  ['waterMains','Water supply · Mains',349.9,'svc'],['waterLocal','Water supply · Local',338.5,'svc'],['gasMain','Gas supply · Main',312.2,'svc'],['gasLocal','Gas supply · Local',300.7,'svc'],
  ['telephone','Telecommunications · Telephone',274.5,'pole'],['coax','Telecommunications · Coaxial/fibre optic cable',263,'svc'],['mobile','Telecommunications · Mobile phone/microwave tower',251.5,'pole'],
  ['carparks','Carparks',225.2,'public'],['footpaths','Footpaths/cycleways',213.7,'public'],['waterStorage','Water storage',202.2,'svc'],['waterStruct','Water storage structures',190.7,'svc'],['otherInfra','Other infrastructure (describe)',179.2,'svc',[178,32]],
  ['publicOpen','Public open space in regular use',167.7,'public'],['rural','Rural/agricultural',156.2,'private'],['forest','Forest',144.7,'private'],['otherOpen','Other open space (not in regular use)',133.2,'private'],['waterways','Waterways',110.2,'private'],['park','National Park etc',98.7,'private'],['kOther','Other',87.3,'svc',[72,136]],
];
const KSCORE = { occ:10, unocc:5, road:10, rail:10, public:5, pole:5, private:2, svc:0 };
const JROWS = [['masonry','Masonry',730.4],['rc','RC',715.2],['gabion','Gabion',698.7],['rsw','RSW',682.3],['other','Other',665.9]];

// UI structure (sections → groups). items: checkbox ids; texts: [key, label]
const SECTIONS = [
  { k:'D', title:'D. Evidence of previous failures', groups:[{ t:'Type', items:R('D.none','D.composite') }, { t:'Mechanism', items:R('D.fall','D.other'), texts:[['D.otherText','Other — describe briefly']] }] },
  { k:'E1', title:'E1. Potentially adverse features', groups:[{ t:'Rock features', items:R('E1.rTension','E1.rNewExc') }, { t:'Number (rock)', items:R('E1.rMany','E1.rNone') }, { t:'Soil / embankment features', items:R('E1.sTension','E1.sNewExc') }, { t:'Number (soil)', items:R('E1.sMajor','E1.sNone') }] },
  { k:'E2', title:'E2. Potentially adverse discontinuities', groups:[{ t:'Rock defects', items:R('E2.planes','E2.open') }, { t:'Number', items:R('E2.many','E2.none') }] },
  { k:'F', title:'F. Installed drainage', groups:[{ t:'Surface drains', items:['F.above','F.lined','F.unlined','F.benches','F.none','F.toe'], texts:[['F.toeType','Type (at toe of batter)']] }, { t:'Pavement / median', items:['F.pavement'], texts:[['F.paveType','Type']] }, { t:'Piped drains', items:R('F.pToe','F.pTrans') }, { t:'Condition of stormwater drainage', items:R('F.cSep','F.cErosion') }, { t:'Subsurface drainage', items:R('F.sPavement','F.sSubsoil') }, { t:'Weepholes in', items:R('F.wRetaining','F.wGeotextile') }, { t:'Scoring only (not printed as a tick)', items:['X.weepBlocked'] }] },
  { k:'G', title:'G. Water carrying services / infrastructure', groups:[{ t:'Type', items:R('G.mains','G.none') }, { t:'Location', items:R('G.visible','G.inferred') }, { t:'Scoring only (not printed as a tick)', items:['X.noStorm'] }] },
  { k:'H', title:'H. Conditions affecting infiltration potential', groups:[{ t:'Condition', items:R('H.pondGround','H.impounded') }, { t:'Vegetation cover', items:R('H.vDense','H.vNone') }, { t:'Other', items:['H.noAdverse'], texts:[['H.other','Other']] }] },
  { k:'I', title:'I. Visible seepage', groups:[{ t:'From installed subsurface drains', items:R('I.weep','I.subsoil') }, { t:'From elsewhere', items:R('I.surface','I.isolated'), texts:[['I.other','Other']] }, { t:'None', items:['I.none'] }, { t:'Seepage water condition', items:R('I.clear','I.clogged') }, { t:'Volume', items:R('I.slight','I.intermittent'), texts:[['I.rate','Estimated rate (if possible)']] }, { t:'Changes from previous conditions', items:R('I.newPoints','I.noPrevious') }, { t:'Weather', texts:[['I.weather','Weather conditions on & preceding inspection day']] }] },
  { k:'J', title:'J. Existing support, stabilisation & control measures', jtable:true, groups:[{ t:'Measures present', items:R('J.shotcrete','J.other'), texts:[['J.otherDesc','Other — describe']] }, { t:'Information from', items:R('J.iObs','J.iOther'), texts:[['J.infoOther','Other source']] }, { t:'Condition of installed measures', items:['J.good','J.na'] }, { t:'Retaining structures', items:R('J.rCrack','J.rCorrosion') }, { t:'Shotcrete', items:R('J.sCrack','J.sDisplace') }, { t:'Anchors / rock bolts / dowels / soil nails', items:R('J.aCorrosion','J.aTension') }, { t:'Mesh / fences / barriers', items:R('J.mAnchorage','J.mDebris') }, { t:'Other', texts:[['J.condOther','Other — describe extent of damage/distress']] }] },
  { k:'K', title:'K. Potentially affected development or features', ktable:true, groups:[{ t:'General nature of adjacent development', items:R('K.residential','K.park') }] },
  { k:'L1', title:'L1. Cutting', groups:[{ t:'Removal / reconstruction', items:R('L1.removeBlocks','L1.flatten') }, { t:'Scale down', items:R('L1.scaleLocal','L1.removeVeg') }, { t:'Mesh', items:R('L1.meshDraped','L1.meshRigid') }, { t:'Shotcrete', items:R('L1.scStruct','L1.soilNails') }, { t:'Rock face support', items:R('L1.rockBolts','L1.rockAnchors') }, { t:'Fences / barriers', items:R('L1.concBarrier','L1.possibleTypes'), texts:[['L1.types','Possible types']] }, { t:'Drainage', items:R('L1.dSurface','L1.dClear') }, { t:'Measures are considered', items:['L1.definable','L1.investigate'] }] },
  { k:'L2', title:'L2. Embankment', groups:[{ t:'Improve / reconstruction', items:R('L2.flatten','L2.remove') }, { t:'Drainage controls', items:R('L2.sealCracks','L2.verify') }, { t:'Measures are considered', items:['L2.definable','L2.investigate'] }] },
  { k:'L3', title:'L3. Monitoring and management', groups:[{ t:'Inspection features', items:['L3.specific','L3.general'], texts:[['L3.specificTxt','Specific — details'],['L3.generalTxt','General — details']] }, { t:'Instrumentation', items:['L3.instExisting','L3.instProposed'], texts:[['L3.instExTxt','Existing — details'],['L3.instPrTxt','Proposed — details']] }, { t:'Inspection and report interval', items:['L3.routine','L3.rainfall','L3.defined'], texts:[['L3.routineFreq','Routine — frequency'],['L3.rainFreq','Rainfall — frequency'],['L3.definedFreq','Defined — frequency']] }, { t:'Responsibility', items:R('L3.rMaint','L3.rGeo') }, { t:'Management', items:R('L3.mSigns','L3.mRMP') }] },
];
const XLBL = { 'X.weepBlocked':'Weepholes partially/totally blocked', 'X.noStorm':'No stormwater drainage' };

// ---------- scoring (Typical Scoring boxes) ----------
const SC_KEYS = ['B1','B2','B3','B4','D','E1','E2','F','G','H','I','J','K'];
const MAX = { E1:80, E2:45, F:10, G:10, J:70, K:10 };
function score(s) {
  const B = s?.B || {}; const sd = s?.sd || {}; const cb = sd.cb || {}; const has = id => !!cb[id]; const any = (...a) => a.some(has);
  const n = v => (v === '' || v == null || !isFinite(+v)) ? null : +v;
  const rawMat = B.matType || (s?.A?.slopeClass === 'Embankment' ? 'Soil' : 'Rock'); const mat = rawMat === 'Fill' ? 'Soil' : rawMat === 'Other' ? 'Rock' : rawMat; const a = {}; const basis = {};
  const ang = n(B.overallA) ?? n(B.batterA);
  a.B1 = ang == null || rawMat === 'Other' || rawMat === 'Fill' ? null : mat === 'Soil' ? (ang >= 45 ? 20 : ang >= 35 ? 15 : ang >= 25 ? 10 : 5) : (ang >= 60 ? 10 : ang >= 50 ? 8 : ang >= 40 ? 5 : 0);
  basis.B1 = rawMat === 'Fill' ? 'Fill · material only, no B.1 score' : rawMat === 'Other' ? `${(B.matOther || 'Other material').trim()} · no auto score — enter override` : ang == null ? 'Enter slope angle' : `${rawMat === 'Fill' ? 'Fill (scored as soil)' : mat} · ${ang}°`;
  const h = n(B.overallH); a.B2 = h == null ? null : h > 30 ? 20 : h >= 20 ? 15 : h >= 10 ? 10 : h >= 5 ? 8 : 0;
  const w = n(B.shoulder); a.B3 = w == null ? null : w > 5 ? 0 : w >= 2 ? 5 : 10;
  const nat = (an, soil) => an == null ? null : soil ? (an >= 45 ? 5 : an >= 35 ? 4 : an >= 25 ? 2 : 0) : (an >= 70 ? 5 : an >= 60 ? 4 : an >= 50 ? 2 : 0);
  const upSoil = has('B.aboveSoil') || (!has('B.aboveRock') && mat === 'Soil'), dnSoil = has('B.belowSoil') || (!has('B.belowRock') && mat === 'Soil');
  const up = nat(n(B.aboveA), upSoil), dn = nat(n(B.belowA), dnSoil);
  basis.B4 = [n(B.aboveA) != null ? `above ${upSoil ? 'Soil' : 'Rock'} ${B.aboveA}° → ${up}` : '', n(B.belowA) != null ? `below ${dnSoil ? 'Soil' : 'Rock'} ${B.belowA}° → ${dn}` : ''].filter(Boolean).join(' · ') || 'Enter slope above / below angle';
  a.B4 = up == null && dn == null ? null : Math.max(up || 0, dn || 0);
  a.D = any('D.soil','D.rock','D.composite','D.fall','D.topple','D.slide','D.rotational','D.translational','D.spread','D.flow','D.complex','D.debris','D.other') ? 5 : 0;
  const rock = Math.min(55, (has('E1.rLoose') ? 10 : 0) + (has('E1.rTension') ? 10 : 0) + (has('E1.rOverhang') ? 10 : 0) + (has('E1.rSheared') ? 10 : 0) + (has('E1.rErodible') ? 5 : 0) + (has('E1.rMany') ? 10 : has('E1.rSome') ? 5 : 0));
  const soil = Math.min(80, (has('E1.sTension') ? 20 : 0) + (has('E1.sToeHeave') ? 20 : 0) + (has('E1.sBulging') ? 20 : 0) + (has('E1.sDeform') ? 10 : 0) + (has('E1.sMajor') ? 10 : has('E1.sMinor') ? 5 : 0));
  a.E1 = Math.max(rock, soil);
  a.E2 = Math.min(45, (has('E2.planes') ? 10 : 0) + (has('E2.wedges') ? 10 : 0) + (has('E2.topple') ? 10 : 0) + (has('E2.open') ? 5 : 0) + (has('E2.many') ? 10 : has('E2.some') ? 5 : 0));
  a.F = Math.min(10, (has('F.none') ? 5 : 0) + (has('X.weepBlocked') ? 5 : 0));
  a.G = Math.min(10, (has('G.mains') ? 5 : 0) + (has('X.noStorm') ? 5 : 0));
  a.H = Math.min(mat === 'Soil' ? 15 : 10, (any('H.tension','H.openJoints') ? 5 : 0) + (any('H.pondGround','H.pondDrains') ? 5 : 0) + (mat === 'Soil' && any('H.vNone','H.vSparse') ? 5 : 0));
  const seepSrc = any(...R('I.weep','I.isolated')) || !!(sd.t?.['I.other'] || '').trim();
  a.I = any('I.high','I.veryHigh') ? 10 : (seepSrc || any('I.slight','I.moderate')) ? 5 : has('I.cessation') ? 5 : 0;
  a.J = Math.min(70, (any('J.rCrack','J.sCrack') ? 10 : 0) + (has('J.rBulge') ? 10 : 0) + (has('J.rTilt') ? 10 : 0) + (has('J.rSettle') ? 10 : 0) + (any('J.rSlide','J.sDisplace') ? 10 : 0) + (has('J.aTension') ? 10 : 0) + (any('J.rCorrosion','J.sCorrosion','J.aCorrosion','J.mCorrosion') ? 5 : 0) + (any('J.rSeepFace','J.rSeepToe','J.sToeSeep','J.sSeepCracks') ? 5 : 0));
  const kd = sd.k || {}; a.K = Math.min(10, Math.max(0, ...KROWS.filter(r => (kd[r[0]]?.a || '').trim() || (kd[r[0]]?.b || '').trim()).map(r => KSCORE[r[3]])));
  const ovr = sd.ovr || {}; const sections = {}; let total = 0;
  SC_KEYS.forEach(k => { const o = ovr[k]; const v = o !== '' && o != null && isFinite(+o) ? +o : a[k]; sections[k] = v; total += v || 0; });
  return { auto: a, basis, mat: rawMat, scoreMat: mat, sections, total, overridden: SC_KEYS.filter(k => ovr[k] !== '' && ovr[k] != null) };
}

// ---------- text positions: key → [page, x, baselineY, width, opts] ----------
const T = {
  id:[1,195,758.4,90], weather:[1,145,745.8,140], completedBy:[1,362,758.4,66], checkedBy:[1,352,745.8,76], date:[1,465,758.4,100], time:[1,460,745.8,100],
  startLink:[1,201,712.3,42], finishLink:[1,320,712.3,36], length:[1,397,712.3,63], cway:[1,557.5,712.3,9], roadNo:[1,91,699.7,40], startDist:[1,207,699.1,37], finishDist:[1,326,699.1,30], side:[1,486,699.1,78],
  lat1:[1,248,673,105], lon1:[1,360,673,100], ele1:[1,465,673,98], lat2:[1,248,647,105], lon2:[1,360,647,100], ele2:[1,465,647,98],
  system:[1,175,622.3,68], zone:[1,164,596.5,78], e1:[1,248,609.6,105], n1:[1,360,609.6,100], rl1:[1,465,609.6,98], e2:[1,248,583.8,105], n2:[1,360,583.8,100], rl2:[1,465,583.8,98],
  planRef:[1,214,570.7,140], planChainage:[1,360,558,100], planCutFill:[1,544,570.7,22], planSide:[1,486,558,78],
  snRank:[1,154,542.5,88], aadt:[1,281,542.5,74], speed:[1,310,529.9,45], year:[1,393,529.9,67], lanes:[1,499,529.9,66], locality:[1,118,516.8,236], sight:[1,514,516.8,50],
  lenCovered:[1,258,419.2,34,{a:'r'}], shoulder:[1,150,406.1,18,{a:'r'}], fallZone:[1,311,406.1,18,{a:'r'}],
  triD:[1,56,375.9,21], triA:[1,90,375.9,23], triB:[1,125,375.9,24], triG:[1,159,375.9,26], triH:[1,200,375.9,50],
  rfA:[1,54,349.5,23], rfW:[1,92,349.5,21], rfD:[1,126,349.5,24], rfLH:[1,210,349.5,50],
  aboveA:[1,74,307.8,17,{a:'r'}], aboveD:[1,174,307.8,23,{a:'r'}], belowA:[1,74,253,17,{a:'r'}], belowD:[1,174,253,23,{a:'r'}], resAbove:[1,106,201.7,20,{a:'r'}], resBelow:[1,261,201.7,21,{a:'r'}],
  scB1:[1,533,413.2,24,{a:'c',s:10}], scB2:[1,533,333,24,{a:'c',s:10}], scB3:[1,533,279.3,24,{a:'c',s:10}], scB4:[1,533,198.2,24,{a:'c',s:10}], scD:[1,538,103.5,24,{a:'c',s:10}],
  'D.otherText':[1,325,53.5,40,{s:8,lines:2}],
  id2:[2,521,774.7,44,{s:10}], id3:[3,513,754.9,50,{s:10}],
  'F.toeType':[4,194,260.7,150], 'F.paveType':[4,72,236.5,270], scE1:[4,537,522.2,24,{a:'c',s:10}], scE2:[4,535,337.5,24,{a:'c',s:10}], scF:[4,537,92.2,24,{a:'c',s:10}],
  'H.other':[5,75,517,270], 'I.other':[5,78,380,265,{lines:2}], 'I.rate':[5,173,265.9,170], 'I.weather':[5,45,172,305,{lines:2}], scG:[5,535,663.5,24,{a:'c',s:10}], scH:[5,535,508.1,24,{a:'c',s:10}], scI:[5,535,380.4,24,{a:'c',s:10}],
  'J.otherType':[6,76,665.9,133], 'J.otherDesc':[6,144,588.3,210,{lines:2}], 'J.infoOther':[6,92,524.8,260], 'J.condOther':[6,76,266.2,275,{lines:3}], scJ:[6,535,251.9,24,{a:'c',s:10}],
  scK:[7,535,96.9,24,{a:'c',s:10}],
  'L1.types':[8,291,552.5,270], 'L3.specificTxt':[8,106,221.7,450], 'L3.generalTxt':[8,104,180,452], 'L3.instExTxt':[8,179,121.9,380], 'L3.instPrTxt':[8,188,109.2,370],
  'L3.routineFreq':[9,296,729,265], 'L3.rainFreq':[9,136,700.6,425], 'L3.definedFreq':[9,235,685,325], comments:[9,45,500,515,{s:10,lines:21}],
  total:[9,132,121.3,60,{a:'c',s:12}],
};
JROWS.forEach(([k, , y]) => { T['j_' + k + '_L'] = [6,211,y,69,{a:'c'}]; T['j_' + k + '_H'] = [6,282,y,73,{a:'c'}]; });
KROWS.forEach(([k, , y, , nm]) => { T['k_' + k + '_a'] = [7,211,y,78,{a:'c'}]; T['k_' + k + '_b'] = [7,289,y,78,{a:'c'}]; if (nm) T['k_' + k + '_n'] = [7,nm[0],y,nm[1]]; });
[['B1',93.25],['B2',127.35],['B3',161.35],['B4',195.35],['D',229.45],['E1',263.55],['E2',297.6],['F',331.65],['G',365.65],['H',399.75],['I',433.75],['J',467.85],['K',501.95]].forEach(([k, cx]) => { T['sum_' + k] = [9,cx - 16,163,32,{a:'c',s:10}]; });
['C','E'].forEach((r, ri) => { const y = ri ? 432.4 : 445.5; [['oh',119.5,41],['oa',161,38],['bh',199.5,42],['ba',242,38],['bw',281.5,42],['bwa',324,38]].forEach(([c, x, w]) => { T[`g${r}_${c}`] = [1,x,y,w,{a:'c'}]; }); });
for (let i = 0; i < 8; i++) { const x0 = 145 + i * 52.7; T['hz' + (i + 1)] = [3,x0 + 13,102.6,38,{s:6.5,min:4.5,lines:2}]; T['pd' + (i + 1)] = [3,x0,85.4,52.7,{a:'c'}]; T['pt' + (i + 1)] = [3,x0,70.5,52.7,{a:'c'}]; T['pp' + (i + 1)] = [3,x0,55.6,52.7,{a:'c',s:8}]; }
const IMG = { S01:[2,52,140,511,592], S02:[3,52,224,445,508] };

// ---------- PDF ----------
const WIN = '€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ';
const clean = v => String(v ?? '').replace(/≥/g, '>=').replace(/≤/g, '<=').replace(/→/g, '->').replace(/⁻/g, '-').replace(/[\u2070-\u2079]/g, c => '0123456789'[c.charCodeAt(0) - 0x2070] || '').replace(/[\u00B9]/g, '1').replace(/[^\n\x20-\x7E\xA0-\xFF]/g, c => WIN.includes(c) ? c : '?');
function wrap(font, text, w, sz) {
  const out = [];
  String(text).split('\n').forEach(para => { let line = ''; para.split(/\s+/).filter(Boolean).forEach(word => { const t = line ? line + ' ' + word : word; if (font.widthOfTextAtSize(t, sz) <= w || !line) line = t; else { out.push(line); line = word; } }); out.push(line); });
  return out;
}
function drawField(page, font, spec, raw, rgb) {
  const [, x, y, w, o = {}] = spec; const text = clean(raw).trim(); if (!text) return;
  const size = o.s || 9, min = o.min || 5, maxLines = o.lines || 1;
  if (/\^-?\d/.test(text) && maxLines === 1) return drawPow(page, font, spec, text, rgb);
  let sz = size, lines = wrap(font, text, w, sz);
  while (sz > min && (lines.length > maxLines || lines.some(l => font.widthOfTextAtSize(l, sz) > w))) { sz -= 0.5; lines = wrap(font, text, w, sz); }
  lines.slice(0, Math.max(maxLines, 1)).forEach((l, i) => {
    const lw = font.widthOfTextAtSize(l, sz); const dx = o.a === 'r' ? w - lw : o.a === 'c' ? (w - lw) / 2 : 0;
    page.drawText(l, { x: x + dx, y: y - i * sz * 1.18, size: sz, font, color: INK(rgb) });
  });
}
function drawPow(page, font, spec, text, rgb) {
  const [, x, y, w, o = {}] = spec; const sz = o.s || 9; const m = text.match(/^(.*?)\^(-?\d+)(.*)$/); const [b, e, t] = [m[1], m[2], m[3]]; const es = sz * 0.7;
  const tw = font.widthOfTextAtSize(b, sz) + font.widthOfTextAtSize(e, es) + font.widthOfTextAtSize(t, sz);
  let cx = x + (o.a === 'c' ? (w - tw) / 2 : o.a === 'r' ? w - tw : 0); const c = INK(rgb);
  page.drawText(b, { x: cx, y, size: sz, font, color: c }); cx += font.widthOfTextAtSize(b, sz);
  page.drawText(e, { x: cx, y: y + sz * 0.38, size: es, font, color: c }); cx += font.widthOfTextAtSize(e, es);
  if (t) page.drawText(t, { x: cx, y, size: sz, font, color: c });
}
function dataUrlBytes(u) { const b = atob(u.split(',')[1]); const a = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) a[i] = b.charCodeAt(i); return a; }
let INK_MODE = 'pencil';
const INK = rgb => INK_MODE === 'pen' ? rgb(0, 0, 0) : rgb(0.42, 0.42, 0.45);
async function build(PDFLib, vals, cbs, imgs = {}, opts = {}) {
  const { PDFDocument, StandardFonts, rgb } = PDFLib; INK_MODE = opts.ink || 'pencil';
  const tpl = dataUrlBytes('data:application/pdf;base64,' + window.SD_TEMPLATE_B64);
  const doc = await PDFDocument.load(tpl); const font = await doc.embedFont(StandardFonts.Helvetica);
  const pages = doc.getPages();
  // drawSvgPath uses a y-down coordinate system from (x, y)
  Object.keys(cbs || {}).forEach(id => { const c = CBI[id]; if (!c || !cbs[id]) return; const pg = pages[c[1] - 1]; pg.drawSvgPath('M 1.4 -4.4 L 3.8 -1.2 L 9.6 -10.2', { x: c[2], y: c[3], borderColor: INK(rgb), borderWidth: 1.2 }); });
  for (const [k, spec] of Object.entries(T)) { const v = vals[k]; if (v == null || v === '') continue; drawField(pages[spec[0] - 1], font, spec, v, rgb); }
  for (const [k, box] of Object.entries(IMG)) {
    const im = imgs[k]; const notes = clean(imgs[k + 'notes'] || '').trim(); const pg = pages[box[0] - 1];
    let [x, y, w, h] = box.slice(1);
    if (notes) {
      const sz = 9; const lines = wrap(font, notes, w - 12, sz).slice(0, 14); const nh = lines.length * sz * 1.2 + 10;
      pg.drawRectangle({ x, y, width: w, height: nh, color: rgb(1, 1, 1), borderColor: rgb(0, 0, 0), borderWidth: 0.5 });
      lines.forEach((l, i) => pg.drawText(l, { x: x + 6, y: y + nh - 6 - sz - i * sz * 1.2 + 1.5, size: sz, font, color: INK(rgb) }));
      y += nh + 6; h -= nh + 6;
    }
    if (im && /^data:image\/(jpe?g|png)/i.test(im)) {
      const bytes = dataUrlBytes(im); const img = /png/i.test(im.slice(0, 20)) ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
      const k2 = Math.min(w / img.width, h / img.height); const iw = img.width * k2, ih = img.height * k2;
      pg.drawImage(img, { x: x + (w - iw) / 2, y: y + h - ih, width: iw, height: ih });
    }
  }
  return await doc.save();
}
window.SD_FORM = { CB, CBI, label, XLBL, RADIO, radioOf, SECTIONS, KROWS, JROWS, KSCORE, SC_KEYS, MAX, score, T, IMG, build };
})();
