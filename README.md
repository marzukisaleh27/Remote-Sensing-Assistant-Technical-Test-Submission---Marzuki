# Technical Exercise: Land Cover Mapping Workflow Replication
## Expert Annotation Tool for Land Cover Mapping

The land cover mapping workflow outlined in the scientific paper titled "A National-Scale Land Cover Reference Dataset from Local Crowdsourcing Initiatives in Indonesia" consists of two main components: (1) crowdsourced land cover (LC) reference data collection by non-experts (crowd annotations), and (2) LC reference data collection by experts (expert annotations).

This repository aims to replicate a portion of the aforementioned workflow, specifically the expert-based LC reference data collection component. The study area is focused on Sidenreng Rappang Regency for the year 2018. While the tools developed in the original paper are comprehensive, this study proposes a simplified approach by implementing a manual expert annotation system based on Google Earth Engine (GEE) applications.

### Overall Plan
I scoped the task to a simplified and localized version of the expert annotation workflow, with a focus on practicality and clarity. The key elements of my plan included :
1. Setup and Scoping:
   * Create a public GitHub repository to store code and documentation.
   * Thoroughly review the source paper’s methodology, focusing on the expert annotation section.
   * Identify key workflows, data dependencies (Sentinel-2, class codes, AOI), and understand GEE-based annotation structure.
2. Tool Design:
   * Use Google Earth Engine (GEE) to develop a visual annotation interface.
   * Focus on the Kabupaten Sidenreng Rappang, South Sulawesi as the area of interest.
   * Use Sentinel-2 imagery from 2018, with median compositing and cloud masking.
3. User-Friendly Interface:
   * Implement simple tools for manual polygon creation, LULC class tagging, and visual interpretation support (indices and color composites).
5. Data Export:
   * Allow annotations to be saved/exported by the user to Google Drive or GEE Assets for further processing or use in classification models.

### Step Taken (3-Hour log)
**Hour 1 – Setup, Scoping, and Imagery Preparation**
  * 15 min. Created a public GitHub repository to store code and documentation. Skimmed and analyzed the source paper, with focus on the expert annotation method and interface elements.
  * 15 min. Analyzed the required data sources: Sentinel-2 (2018), AOI boundaries, class labels (17 LULC classes). Searched for the AOI using the GAUL (GADM-like) dataset and filtered by `"ADM2_NAME" = "Sidenreng Rappang"`.
  * 15 min. Filtered Sentinel-2 Surface Reflectance imagery (2018) with cloud masking (QA60). Generated median composite for visualization.
  * 15 min. Created true color and false color renderings for split panel display. <br>
**Hour 2 – UI and Interactive Map Development**
  * 15 min. Designed basic ui.Panel layout for the left panel (descriptions, controls). Created dropdown selector for 17-class LULC scheme.
  * 15 min. Set up split-panel map view (True Color vs. False Color). Synchronized map zoom and extent.
  * 15 min. Added layer selector for optional indices: NDVI, NDWI, NBR. Implemented toggle logic and reactivity.
  * 15 min. Linked LULC key document (PDF on Google Drive) from the left panel. Added guidance text for annotators. <br>
**Hour 3 – Annotation and Export System**
  * 30 min. Enabled `ui.Map.drawingTools()` for polygon digitizing. Linked dropdown class selection to drawn polygon as metadata property. Visual feedback on added features (color-coded, optional print to console).
  * 15 min. Added Export to Google Drive feature with filename input. Validated task creation in Tasks tab.
  * 15 min. Added Export to GEE Assets option with editable asset path. Final testing and cleanup of UI layout and instructions.

### Challenges Encountered
During development, several technical challenges arose. First, GEE’s UI system is limited, offering only basic components without support for custom styling or layout frameworks. This made it necessary to keep the interface very minimal and functional.

Another issue was that drawn features are temporary—any polygons created by the user are lost if the page is refreshed or closed without export. This could be problematic for long annotation sessions. Additionally, GEE Apps do not support user authentication, so all annotations are anonymous unless users manually enter their name or initials.

The cloud masking technique using Sentinel-2’s QA60 band worked reasonably well but still allowed residual cloud shadows and haze, which may affect visual interpretation. Another limitation is that all export tasks must be triggered manually, requiring users to open the “Tasks” tab and confirm exports themselves. Finally, there’s no autosave mechanism in place, which means that annotations must be exported frequently to avoid data loss.

### Proposed Solutions
To work around the UI limitations, I adopted a minimalist layout using built-in `ui.Panel` components and a straightforward split-map design. This solution worked well for the scope of this project.

To address the temporary nature of the annotations, I implemented manual export buttons to both Google Drive and Earth Engine Assets. Clear instructions were provided to users, advising them to frequently export their annotations. Although a full autosave feature wasn’t implemented, this approach mitigated potential data loss.

For the lack of authentication, I planned to include a text input field for annotators to enter their ID or initials, which could be saved as a property on each polygon. A more robust team-based solution would involve integrating Firebase or Google login for better tracking and quality assurance.

Regarding the cloud mask imperfections, users are encouraged to annotate only visually clear regions. A future team solution could be to preprocess cloud-free composites using multi-temporal mosaics or tools like `s2cloudless`, improving image clarity for annotation tasks.

Finally, while export still requires users to confirm tasks manually, a longer-term team solution could involve automating the export process via the Earth Engine Python API, which would streamline workflows and improve efficiency for large-scale annotation projects.









