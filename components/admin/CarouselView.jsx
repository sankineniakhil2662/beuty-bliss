"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import AdminTopBar from "./AdminTopBar";
import CarouselUploadForm from "./CarouselUploadForm";
import CarouselGrid from "./CarouselGrid";
import FeaturedPicker from "./FeaturedPicker";
import Banner from "./Banner";
import EmptyState from "./EmptyState";
import {
  addCarouselImage,
  deleteCarouselImage,
  fetchAllCarouselImagesAdmin,
  setCarouselImageActive,
} from "@/lib/carousel";
import {
  FEATURED_LIMIT,
  fetchAllServicesAdmin,
  setServiceFeatured,
} from "@/lib/services";

export default function CarouselView() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState(null);
  const [bannerType, setBannerType] = useState("ok");
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    fetchAllCarouselImagesAdmin()
      .then(setImages)
      .catch(() => {
        setBannerType("err");
        setBanner("Couldn't load carousel images — check you're signed in as admin.");
      })
      .finally(() => setLoading(false));

    fetchAllServicesAdmin()
      .then(setServices)
      .catch(() => {
        setBannerType("err");
        setBanner("Couldn't load services — check you're signed in as admin.");
      })
      .finally(() => setServicesLoading(false));
  }, []);

  const handleToggleFeatured = async (service) => {
    const nowFeatured = !service.isFeatured;
    setBusyId(service.id);
    setServices((prev) =>
      prev.map((s) =>
        s.id === service.id ? { ...s, isFeatured: nowFeatured } : s
      )
    );
    try {
      await setServiceFeatured(service.id, nowFeatured);
      setBannerType("ok");
      setBanner(
        nowFeatured
          ? `${service.name} now appears on the home page.`
          : `${service.name} removed from the home page.`
      );
    } catch {
      setServices((prev) =>
        prev.map((s) =>
          s.id === service.id ? { ...s, isFeatured: !nowFeatured } : s
        )
      );
      setBannerType("err");
      setBanner("Update failed — please try again.");
    } finally {
      setBusyId(null);
    }
  };

  const featuredCount = services.filter(
    (s) => s.isActive && s.isFeatured
  ).length;

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
      <AdminTopBar
        title="Carousel"
        subtitle="Manage the home-page hero carousel and featured treatments"
      />

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

      <div className="panel" style={{ marginTop: 22 }}>
        <div className="panel-head">
          <h3>Featured on home page</h3>
          <span style={{ fontSize: 12, color: "var(--muted)" }}>
            {featuredCount} of {FEATURED_LIMIT} chosen · shown under “Loved by
            our clients”
          </span>
        </div>
        {servicesLoading ? (
          <EmptyState
            icon={Loader2}
            spin
            title="Loading services…"
            message="One moment."
          />
        ) : (
          <FeaturedPicker
            services={services}
            onToggle={handleToggleFeatured}
            busyId={busyId}
          />
        )}
      </div>
    </div>
  );
}
