import undergradTemplate from "../assets/images/undergrad-template.jpg";
import postgradTemplate from "../assets/images/postgrad-template.jpg";

// Admin-only visual reference overlaid on DocumentPositionCanvas to help line
// up field positions against the physical paper template. Never printed.
// TODO: fix 'template image size too large'
export const DOCUMENT_TEMPLATE_IMAGE_BY_TYPE: Record<string, string> = {
    undergraduate: undergradTemplate,
    postgraduate: postgradTemplate,
};
