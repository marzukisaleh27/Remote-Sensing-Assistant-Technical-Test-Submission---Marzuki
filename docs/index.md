---
title: Expert Annotation Tool Documentation
---

# Expert Annotation Tool
This project is a simplified replication of the *expert annotation* component from the research:

> *"A national-scale land cover reference dataset from local crowdsourcing initiatives in Indonesia."*

It enables users to annotate land cover classes directly in **Google Earth Engine (GEE)** using 2018 Sentinel-2 imagery, with the goal of building reliable, expert-validated reference data.

---

## Key Features

- **Split-panel visualization**: Compare True Color and False Color imagery side by side.
- **Optional layers**: Toggle NDVI, NDWI, and NBR layers to assist interpretation.
- **Annotation tools**: Draw polygons and assign land cover classes using a dropdown menu.
- **Export options**: Save your annotations to Google Drive or Earth Engine Assets.
- **Simple, clean interface**: Designed for ease of use by domain experts and field practitioners.

---

## Land Cover Classes

The tool supports annotation of 17 land cover classes:

1. Undisturbed Dryland Forest  
2. Logged-Over Dryland Forest  
3. Undisturbed Mangrove Forest  
4. Logged-Over Mangrove Forest  
5. Undisturbed Swamp Forest  
6. Logged-Over Swamp Forest  
7. Agroforestry  
8. Plantation Forest  
9. Rubber Monoculture  
10. Oil Palm Monoculture  
11. Other Monoculture  
12. Grass or Savanna  
13. Shrub  
14. Cropland  
15. Settlement  
16. Cleared Land  
17. Water Bodies  

---

## Interpretation Key

A visual interpretation guide is available here:

👉 [Download LULC Key PDF]([https://drive.google.com/your-key-pdf-link-here](https://drive.google.com/file/d/1_eI22tF-3LW7Ri3oXggSUIpqqOrNlOD6/view?usp=drive_link))  
*(You may right-click and open in a new tab.)*

---

## How to Use

1. Open the GEE App (link provided in this repo).
2. Use the split map to visually compare color composites.
3. Toggle additional indices if needed.
4. Draw a polygon using the drawing tools.
5. Select the appropriate LULC class.
6. Click **“Add Annotation”**.
7. After digitizing, click **“Export to Drive”** or **“Export to Assets”**.

> ⚠️ Don’t forget to run the export task from the Tasks tab!

---
