/* KEMEK Deal Pipeline — PUBLIC dataset. Generated from the master spreadsheet; regenerate via the admin screen (Export → public). */
window.KEMEK_PIPELINE = {
 "research_date": "2026-09-19",
 "generated": "2026-09-19",
 "stages": [
  "Screening",
  "Shortlist",
  "GO — Deal Room",
  "Bid / Offer",
  "Exchanged",
  "Completed",
  "Passed"
 ],
 "assumptions": [
  {
   "key": "bid_premium_pct",
   "label": "Bid premium over guide",
   "value": 0.0,
   "unit": "%",
   "status": "ASSUMED",
   "note": "Auction lots often sell above guide. 0% = buy at guide. Raise this to stress the acquisition price."
  },
  {
   "key": "auction_fee",
   "label": "Auction admin / buyer fee",
   "value": null,
   "unit": "£",
   "status": "TBD",
   "note": "Read the specific lot's buyer-fee page and legal pack; varies by auctioneer and lot."
  },
  {
   "key": "legal",
   "label": "Legal / conveyancing (purchase)",
   "value": null,
   "unit": "£",
   "status": "TBD",
   "note": "Obtain a quote from Setfords (Omotola Balogun) per lot — legal-pack review + purchase."
  },
  {
   "key": "survey",
   "label": "Survey",
   "value": null,
   "unit": "£",
   "status": "TBD",
   "note": "Level 2/3 survey or specialist (listed / structural) — quote per property."
  },
  {
   "key": "refurb",
   "label": "Refurbishment",
   "value": null,
   "unit": "£",
   "status": "TBD",
   "note": "No refurb figure is evidenced for any lot. Enter a costed schedule per property (Kemek refurb template)."
  },
  {
   "key": "professional",
   "label": "Professional / planning",
   "value": null,
   "unit": "£",
   "status": "TBD",
   "note": "Architect, planning, listed-building consent, structural engineer where relevant."
  },
  {
   "key": "contingency_pct",
   "label": "Contingency on refurb + professional",
   "value": 10.0,
   "unit": "%",
   "status": "ASSUMED",
   "note": "Kemek standard 10% — editable."
  },
  {
   "key": "ltv_pct",
   "label": "Bridging loan-to-value on purchase",
   "value": 70.0,
   "unit": "%",
   "status": "ASSUMED",
   "note": "In line with Kemek's DIPs on Project Harwood Manor (c.70% of purchase). Editable."
  },
  {
   "key": "rate_month_pct",
   "label": "Bridging interest per month",
   "value": 0.995,
   "unit": "%",
   "status": "ASSUMED",
   "note": "From the Apex (via Knightly) DIP on Harwood Manor — 0.995% pm. Replace with the lender's actual quote."
  },
  {
   "key": "term_months",
   "label": "Bridging term",
   "value": 9,
   "unit": "months",
   "status": "ASSUMED",
   "note": "Apex DIP term. Editable."
  },
  {
   "key": "arrangement_pct",
   "label": "Lender arrangement fee",
   "value": 2.0,
   "unit": "% of loan",
   "status": "ASSUMED",
   "note": "Typical bridging arrangement fee — confirm per DIP."
  },
  {
   "key": "exit_agent_pct",
   "label": "Exit — selling agent fee",
   "value": 1.5,
   "unit": "% of end value",
   "status": "ASSUMED",
   "note": "Typical sole-agency fee — editable."
  },
  {
   "key": "exit_legal",
   "label": "Exit — legal on sale",
   "value": null,
   "unit": "£",
   "status": "TBD",
   "note": "Quote per sale."
  },
  {
   "key": "dev_upside",
   "label": "Development / planning upside",
   "value": null,
   "unit": "£",
   "status": "TBD",
   "note": "Only for KEM-002 and KEM-013. Kept separate from residential value; not counted in any case until planning is evidenced."
  }
 ],
 "tax_tables": {
  "SDLT_RES_HIGHER": {
   "label": "SDLT — residential, higher rates (company / additional dwelling)",
   "bands": [
    [
     0,
     0.05
    ],
    [
     125000,
     0.07
    ],
    [
     250000,
     0.1
    ],
    [
     925000,
     0.15
    ],
    [
     1500000,
     0.17
    ]
   ],
   "flat_pct": 0.0,
   "note": "Company buying residential over £500k can fall into the 15% flat rate unless property-trading/development relief applies — confirm with solicitor."
  },
  "SDLT_NONRES": {
   "label": "SDLT — non-residential / mixed-use",
   "bands": [
    [
     0,
     0.0
    ],
    [
     150000,
     0.02
    ],
    [
     250000,
     0.05
    ]
   ],
   "flat_pct": 0.0,
   "note": "Applies to the Wigan commercial parade."
  },
  "LTT_RES_HIGHER": {
   "label": "LTT (Wales) — residential, higher rates",
   "bands": [
    [
     0,
     0.05
    ],
    [
     180000,
     0.085
    ],
    [
     250000,
     0.1
    ],
    [
     400000,
     0.125
    ],
    [
     750000,
     0.15
    ],
    [
     1500000,
     0.17
    ]
   ],
   "flat_pct": 0.0,
   "note": "If KEM-002 (c.11 acres) qualifies as mixed-use, non-residential LTT (0% to £225k, 1% to £250k, 5% to £1m) would apply instead — classification TBD."
  },
  "LBTT_RES_ADS": {
   "label": "LBTT (Scotland) — residential + ADS",
   "bands": [
    [
     0,
     0.0
    ],
    [
     145000,
     0.02
    ],
    [
     250000,
     0.05
    ],
    [
     325000,
     0.1
    ],
    [
     750000,
     0.12
    ]
   ],
   "flat_pct": 0.08,
   "note": "ADS 8% on the full price for a company / additional dwelling."
  }
 },
 "private_fields": [
  "address",
  "source",
  "research",
  "correction",
  "original_claim",
  "comps",
  "flags",
  "costs",
  "scenarios",
  "size_sqft",
  "income_pcm",
  "commercial"
 ],
 "disclaimer": "Indicative end values are analytical ranges, not formal valuations. Every figure carries its source, date checked and confidence. Legal packs, title, planning and surveys must be checked before bidding.",
 "deals": [
  {
   "id": "KEM-001",
   "headline": "Former HMO, Bedford",
   "area": "Bedford, Bedfordshire",
   "outcode": "MK40",
   "region": "England",
   "nation": "England",
   "type": "Residential / former HMO",
   "category": "Residential",
   "config": "7 rooms",
   "guide": [
    350000,
    400000
   ],
   "guide_label": "£350k–£400k",
   "value": [
    650000,
    725000,
    800000
   ],
   "value_label": "£650k–£800k",
   "value_kind": "GDV",
   "tax": "SDLT_RES_HIGHER",
   "confidence": "Medium",
   "date_checked": "2026-09-19",
   "stage": "Screening",
   "published": true,
   "public_fields": [
    "headline",
    "area",
    "outcode",
    "region",
    "nation",
    "type",
    "category",
    "config",
    "guide",
    "guide_label",
    "value",
    "value_label",
    "value_kind",
    "confidence",
    "date_checked",
    "stage",
    "tax"
   ],
   "research_date": "2026-09-19"
  },
  {
   "id": "KEM-002",
   "headline": "Farmhouse, cottage & c.11 acres, Bangor",
   "area": "Mynydd Llandygai, Bangor, Gwynedd",
   "outcode": "LL57",
   "region": "Wales",
   "nation": "Wales",
   "type": "Rural estate / farmhouse + cottage + land",
   "category": "Rural",
   "config": "3-bed cottage + farmhouse",
   "guide": [
    250000,
    300000
   ],
   "guide_label": "£250k–£300k",
   "value": [
    500000,
    575000,
    650000
   ],
   "value_label": "£500k–£650k",
   "value_kind": "Residential value (development upside separate)",
   "tax": "LTT_RES_HIGHER",
   "confidence": "Low–Medium",
   "date_checked": "2026-09-19",
   "stage": "Screening",
   "published": true,
   "public_fields": [
    "headline",
    "area",
    "outcode",
    "region",
    "nation",
    "type",
    "category",
    "config",
    "guide",
    "guide_label",
    "value",
    "value_label",
    "value_kind",
    "confidence",
    "date_checked",
    "stage",
    "tax"
   ],
   "research_date": "2026-09-19"
  },
  {
   "id": "KEM-003",
   "headline": "Period stone house, Old, Northampton",
   "area": "Old, Northampton",
   "outcode": "NN6",
   "region": "England",
   "nation": "England",
   "type": "Detached period stone house",
   "category": "Residential",
   "config": "5 bed",
   "guide": [
    490000,
    490000
   ],
   "guide_label": "£490k guide",
   "value": [
    550000,
    600000,
    650000
   ],
   "value_label": "£550k–£650k",
   "value_kind": "GDV",
   "tax": "SDLT_RES_HIGHER",
   "confidence": "Medium",
   "date_checked": "2026-09-19",
   "stage": "Screening",
   "published": true,
   "public_fields": [
    "headline",
    "area",
    "outcode",
    "region",
    "nation",
    "type",
    "category",
    "config",
    "guide",
    "guide_label",
    "value",
    "value_label",
    "value_kind",
    "confidence",
    "date_checked",
    "stage",
    "tax"
   ],
   "research_date": "2026-09-19"
  },
  {
   "id": "KEM-004",
   "headline": "Grade II listed lodge, Wellingborough",
   "area": "Wellingborough, Northamptonshire",
   "outcode": "NN8",
   "region": "England",
   "nation": "England",
   "type": "Grade II listed detached lodge",
   "category": "Listed",
   "config": "3 bed",
   "guide": [
    290000,
    315000
   ],
   "guide_label": "£290k–£315k",
   "value": [
    350000,
    387500,
    425000
   ],
   "value_label": "£350k–£425k",
   "value_kind": "GDV",
   "tax": "SDLT_RES_HIGHER",
   "confidence": "Medium",
   "date_checked": "2026-09-19",
   "stage": "Screening",
   "published": true,
   "public_fields": [
    "headline",
    "area",
    "outcode",
    "region",
    "nation",
    "type",
    "category",
    "config",
    "guide",
    "guide_label",
    "value",
    "value_label",
    "value_kind",
    "confidence",
    "date_checked",
    "stage",
    "tax"
   ],
   "research_date": "2026-09-19"
  },
  {
   "id": "KEM-005",
   "headline": "Multi-let retail parade, Wigan",
   "area": "Wigan town centre",
   "outcode": "WN1",
   "region": "England",
   "nation": "England",
   "type": "Freehold multi-let retail parade",
   "category": "Commercial",
   "config": "5–6 units",
   "guide": [
    475000,
    475000
   ],
   "guide_label": "£475k current guide",
   "value": [
    418750,
    450000,
    854471
   ],
   "value_label": "£420k–£480k at current rent; £800k–£1.0m only if ERV achieved",
   "value_kind": "Income value (rent ÷ yield) — NOT GDV",
   "tax": "SDLT_NONRES",
   "confidence": "Medium",
   "date_checked": "2026-09-19",
   "stage": "Screening",
   "published": true,
   "public_fields": [
    "headline",
    "area",
    "outcode",
    "region",
    "nation",
    "type",
    "category",
    "config",
    "guide",
    "guide_label",
    "value",
    "value_label",
    "value_kind",
    "confidence",
    "date_checked",
    "stage",
    "tax"
   ],
   "research_date": "2026-09-19"
  },
  {
   "id": "KEM-006",
   "headline": "Village cottage, Stoke Goldington",
   "area": "Stoke Goldington, Newport Pagnell",
   "outcode": "MK16",
   "region": "England",
   "nation": "England",
   "type": "Cottage",
   "category": "Residential",
   "config": "2 bed",
   "guide": [
    250000,
    260000
   ],
   "guide_label": "£250k–£260k",
   "value": [
    400000,
    437500,
    475000
   ],
   "value_label": "£400k–£475k",
   "value_kind": "GDV",
   "tax": "SDLT_RES_HIGHER",
   "confidence": "Medium",
   "date_checked": "2026-09-19",
   "stage": "Screening",
   "published": true,
   "public_fields": [
    "headline",
    "area",
    "outcode",
    "region",
    "nation",
    "type",
    "category",
    "config",
    "guide",
    "guide_label",
    "value",
    "value_label",
    "value_kind",
    "confidence",
    "date_checked",
    "stage",
    "tax"
   ],
   "research_date": "2026-09-19"
  },
  {
   "id": "KEM-007",
   "headline": "Detached rural residence, Ryton",
   "area": "Ryton, Tyne and Wear",
   "outcode": "NE40",
   "region": "England",
   "nation": "England",
   "type": "Detached rural residence",
   "category": "Residential",
   "config": "4 bed",
   "guide": [
    550000,
    550000
   ],
   "guide_label": "£550k guide",
   "value": [
    600000,
    650000,
    700000
   ],
   "value_label": "£600k–£700k",
   "value_kind": "GDV",
   "tax": "SDLT_RES_HIGHER",
   "confidence": "Medium",
   "date_checked": "2026-09-19",
   "stage": "Screening",
   "published": true,
   "public_fields": [
    "headline",
    "area",
    "outcode",
    "region",
    "nation",
    "type",
    "category",
    "config",
    "guide",
    "guide_label",
    "value",
    "value_label",
    "value_kind",
    "confidence",
    "date_checked",
    "stage",
    "tax"
   ],
   "research_date": "2026-09-19"
  },
  {
   "id": "KEM-008",
   "headline": "Detached house, Stokenham, South Devon",
   "area": "Stokenham, Kingsbridge, Devon",
   "outcode": "TQ7",
   "region": "England",
   "nation": "England",
   "type": "Detached house",
   "category": "Residential",
   "config": "5 bed",
   "guide": [
    200000,
    200000
   ],
   "guide_label": "£200k guide",
   "value": [
    500000,
    575000,
    650000
   ],
   "value_label": "£500k–£650k",
   "value_kind": "GDV",
   "tax": "SDLT_RES_HIGHER",
   "confidence": "Medium",
   "date_checked": "2026-09-19",
   "stage": "Screening",
   "published": true,
   "public_fields": [
    "headline",
    "area",
    "outcode",
    "region",
    "nation",
    "type",
    "category",
    "config",
    "guide",
    "guide_label",
    "value",
    "value_label",
    "value_kind",
    "confidence",
    "date_checked",
    "stage",
    "tax"
   ],
   "research_date": "2026-09-19"
  },
  {
   "id": "KEM-009",
   "headline": "Semi-detached bungalow, Soham",
   "area": "Soham, Ely, Cambridgeshire",
   "outcode": "CB7",
   "region": "England",
   "nation": "England",
   "type": "Semi-detached bungalow",
   "category": "Residential",
   "config": "3 bed",
   "guide": [
    225000,
    225000
   ],
   "guide_label": "£225k guide",
   "value": [
    330000,
    357500,
    385000
   ],
   "value_label": "£330k–£385k",
   "value_kind": "GDV",
   "tax": "SDLT_RES_HIGHER",
   "confidence": "Medium",
   "date_checked": "2026-09-19",
   "stage": "Screening",
   "published": true,
   "public_fields": [
    "headline",
    "area",
    "outcode",
    "region",
    "nation",
    "type",
    "category",
    "config",
    "guide",
    "guide_label",
    "value",
    "value_label",
    "value_kind",
    "confidence",
    "date_checked",
    "stage",
    "tax"
   ],
   "research_date": "2026-09-19"
  },
  {
   "id": "KEM-010",
   "headline": "Contemporary villa, Rhynd, Perth",
   "area": "Rhynd, Perth, Perth and Kinross",
   "outcode": "PH2",
   "region": "Scotland",
   "nation": "Scotland",
   "type": "Detached contemporary villa",
   "category": "Residential",
   "config": "5 bed",
   "guide": [
    315000,
    315000
   ],
   "guide_label": "£315k guide",
   "value": [
    400000,
    450000,
    500000
   ],
   "value_label": "£400k–£500k",
   "value_kind": "GDV",
   "tax": "LBTT_RES_ADS",
   "confidence": "Medium",
   "date_checked": "2026-09-19",
   "stage": "Screening",
   "published": true,
   "public_fields": [
    "headline",
    "area",
    "outcode",
    "region",
    "nation",
    "type",
    "category",
    "config",
    "guide",
    "guide_label",
    "value",
    "value_label",
    "value_kind",
    "confidence",
    "date_checked",
    "stage",
    "tax"
   ],
   "research_date": "2026-09-19"
  },
  {
   "id": "KEM-011",
   "headline": "Detached executive house, Aberdeen",
   "area": "Garthdee, Aberdeen",
   "outcode": "AB10",
   "region": "Scotland",
   "nation": "Scotland",
   "type": "Detached executive house",
   "category": "Residential",
   "config": "4 bed",
   "guide": [
    260000,
    260000
   ],
   "guide_label": "£260k current guide",
   "value": [
    360000,
    385000,
    410000
   ],
   "value_label": "£360k–£410k",
   "value_kind": "GDV",
   "tax": "LBTT_RES_ADS",
   "confidence": "Medium",
   "date_checked": "2026-09-19",
   "stage": "Screening",
   "published": true,
   "public_fields": [
    "headline",
    "area",
    "outcode",
    "region",
    "nation",
    "type",
    "category",
    "config",
    "guide",
    "guide_label",
    "value",
    "value_label",
    "value_kind",
    "confidence",
    "date_checked",
    "stage",
    "tax"
   ],
   "research_date": "2026-09-19"
  },
  {
   "id": "KEM-012",
   "headline": "House + annexe, Harwich",
   "area": "Harwich, Essex",
   "outcode": "CO12",
   "region": "England",
   "nation": "England",
   "type": "Semi-detached house + annexe",
   "category": "Residential",
   "config": "3 bed + 1-bed annexe",
   "guide": [
    200000,
    200000
   ],
   "guide_label": "£200k current guide",
   "value": [
    300000,
    325000,
    350000
   ],
   "value_label": "£300k–£350k",
   "value_kind": "GDV",
   "tax": "SDLT_RES_HIGHER",
   "confidence": "Medium",
   "date_checked": "2026-09-15",
   "stage": "Screening",
   "published": true,
   "public_fields": [
    "headline",
    "area",
    "outcode",
    "region",
    "nation",
    "type",
    "category",
    "config",
    "guide",
    "guide_label",
    "value",
    "value_label",
    "value_kind",
    "confidence",
    "date_checked",
    "stage",
    "tax"
   ],
   "research_date": "2026-09-19"
  },
  {
   "id": "KEM-013",
   "headline": "Grade II farmhouse + holiday-let barn, Hinderwell",
   "area": "Hinderwell, Saltburn-by-the-Sea, North Yorkshire",
   "outcode": "TS13",
   "region": "England",
   "nation": "England",
   "type": "Grade II listed farmhouse + holiday-let barn + old farmhouse/storage",
   "category": "Listed",
   "config": "6 bed combined",
   "guide": [
    375000,
    375000
   ],
   "guide_label": "£375k guide",
   "value": [
    500000,
    575000,
    650000
   ],
   "value_label": "£500k–£650k combined; development upside separate",
   "value_kind": "Residential value (development upside separate)",
   "tax": "SDLT_RES_HIGHER",
   "confidence": "Low–Medium",
   "date_checked": "2026-09-19",
   "stage": "Screening",
   "published": true,
   "public_fields": [
    "headline",
    "area",
    "outcode",
    "region",
    "nation",
    "type",
    "category",
    "config",
    "guide",
    "guide_label",
    "value",
    "value_label",
    "value_kind",
    "confidence",
    "date_checked",
    "stage",
    "tax"
   ],
   "research_date": "2026-09-19"
  }
 ]
};
