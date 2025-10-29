import express from "express";

const router = express.Router();

router.get("/maps-key", (req, res) => {
  const key = process.env.VITE_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY || "";
  if (!key) {
    return res.status(404).json({ message: "Maps API key not found in server environment" });
  }
  res.json({ mapsApiKey: key });
});

export default router;


