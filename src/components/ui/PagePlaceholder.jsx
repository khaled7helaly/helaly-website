import Container from "./Container";

function PagePlaceholder({ title }) {
  return (
    <section className="py-16 sm:py-20">
      <Container className="min-h-[50vh]">
        <h1 className="max-w-2xl text-heading-lg font-bold leading-tight text-text-primary">
          {title}
        </h1>
      </Container>
    </section>
  );
}

export default PagePlaceholder;
