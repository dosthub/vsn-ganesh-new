import { getDataSource } from "@/services";
import { PageHeading } from "@/components/common/Shared";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
export const metadata = {
  title: "Celebration Gallery",
  description: "Our Ganesh Chaturthi memories and community moments.",
};
export default async function Page() {
  const photos = await getDataSource().getGallery();
  return (
    <div className="container page-container">
      <PageHeading
        eyebrow="OUR PEOPLE. OUR CELEBRATIONS."
        title="Our Ganesh Chaturthi memories"
        description="The prayers, the laughter and the moments that bring us together."
      />
      <GalleryGrid photos={photos} />
      <p className="account-note">
        The celebration years for these photos have not yet been recorded.
        Choose “All years” to see every memory.
      </p>
    </div>
  );
}
