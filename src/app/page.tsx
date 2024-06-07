import Container from "@/components/Container";
import PromptForm from "@/components/home/PromptForm";

export default async function Home() {
  return (
    <main className="">
      <Container>
        <PromptForm />
      </Container>
    </main>
  );
}
