"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import AdminTopBar from "./AdminTopBar";
import CarouselUploadForm from "./CarouselUploadForm";
import CarouselGrid from "./CarouselGrid";
import Banner from "./Banner";
import EmptyState from "./EmptyState";
import {
  addCarouselImage,
  deleteCarouselImage,
  fetchAllCarouselImagesAdmin,
  setCarouselImageActive,
} from "@/lib/carousel";

export default function CarouselView() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState(null);
  const [bannerType, setBannerType] = useState("ok");

  useEffect(() => {
    fetchAllCarouselImagesAdmin()
      .then(setImages)
      .catch(() => {
        setBannerType("err");
        setBanner("Couldn't load carousel images — check you're signed in as admin.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async ({ imageUrl, alt }) => {
    const sortOrder = images.length
      ? Math.max(...images.map((i) => i.sortOrder ?? 0)) + 1
      : 0;
    const { id } = await addCarouselImage({ imageUrl, alt, sortOrder });
    setImages((prev) => [...prev, { id, imageUrl, alt, sortOrder, isActive: true }]);
    setBannerType("ok");
    setBanner("Image added to the home-page carousel.");
  };

  const handleToggle = async (img) => {
    const nowActive = !img.isActive;
    setImages((prev) =>
      prev.map((i) => (i.id === img.id ? { ...i, isActive: nowActive } : i))
    );
    try {
      await setCarouselImageActive(img.id, nowActive);
    } catch {
      setImages((prev) =>
        prev.map((i) => (i.id === img.id ? { ...i, isActive: !nowActive } : i))
      );
      setBannerType("err");
      setBanner("Update failed — please try again.");
      return;
    }
    setBannerType("ok");
    setBanner(nowActive ? "Slide is visible again." : "Slide hidden from the carousel.");
  };

  const handleRemove = async (img) => {
    const prev = images;
    setImages((p) => p.filter((i) => i.id !== img.id));
    try {
      await deleteCarouselImage(img.id);
      setBannerType("ok");
      setBanner("Slide removed.");
    } catch {
      setImages(prev);
      setBannerType("err");
      setBanner("Couldn't remove — please try again.");
    }
  };

  return (
    <div>
      <AdminTopBar title="Carousel" subtitle="Manage the home-page hero image carousel" />

      <Banner type={bannerType} message={banner} onDismiss={() => setBanner(null)} />

      <CarouselUploadForm onAdd={handleAdd} />

      <div className="panel">
        <div className="panel-head">
          <h3>Slides</h3>
        </div>
        {loading ? (
          <EmptyState icon={Loader2} spin title="Loading carousel…" message="One moment." />
        ) : (
          <CarouselGrid images={images} onToggle={handleToggle} onRemove={handleRemove} />
        )}
      </div>
    </div>
  );
}
