import TokenReview from "@/components/reviews/TokenReview";

export default async function ReviewTokenPage({ params }) {
  const { token } = await params;
  return <TokenReview token={token} />;
}
