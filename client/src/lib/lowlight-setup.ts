import { common, createLowlight } from "lowlight";

// Create lowlight instance with common languages
const lowlight = createLowlight(common);

// Export for use in Tiptap
export default lowlight;
