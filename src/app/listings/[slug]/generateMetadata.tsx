async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return {
    title: `${title} | UPP-LINK Marketplace`,
    description: `Premium verified ${title.toLowerCase()} listing. Direct owner contact.`,
  };
}

export default generateMetadata;
