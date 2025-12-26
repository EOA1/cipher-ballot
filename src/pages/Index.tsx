import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/Layout";
import { Shield, Lock, Eye, Zap, Vote, ArrowRight } from "lucide-react";

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-12 md:py-20">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
        </div>

        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground opacity-0 animate-fade-in">
            <Shield className="h-4 w-4 text-primary" />
            Powered by Zama Fully Homomorphic Encryption
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground opacity-0 animate-fade-in animation-delay-100 md:text-5xl lg:text-6xl">
            A secure and encrypted Voting platform for{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              all Communities
            </span>
          </h1>

          <p className="mb-8 text-lg text-muted-foreground opacity-0 animate-fade-in animation-delay-200 md:text-xl">
            CipherVote enables truly private platform for you to express your opinion. Votes are encrypted before, 
            during, and after voting — only the final tally is revealed.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 opacity-0 animate-fade-in animation-delay-300 sm:flex-row">
            <Button asChild size="lg" className="w-full gap-2 sm:w-auto">
              <Link to="/create">
                <Vote className="h-5 w-5" />
                Create a Vote
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full gap-2 sm:w-auto">
              <Link to="/votes">
                View Active Votes
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Privacy Matters */}
      <section className="py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">
            Why Privacy Matters
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Traditional blockchain voting exposes individual choices, enabling vote buying 
            and social coercion. CipherVote changes that.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <FeatureCard
            icon={Lock}
            title="Votes Are Encrypted"
            description="Every vote is encrypted using Fully Homomorphic Encryption before submission. No one — not even validators — can see individual votes."
            delay={0}
          />
          <FeatureCard
            icon={Eye}
            title="No Vote Buying or Coercion"
            description="Since votes are hidden, there's no way to prove how you voted. This eliminates the ability to buy votes or pressure voters."
            delay={100}
          />
          <FeatureCard
            icon={Zap}
            title="Powered by Zama FHE"
            description="Built on Zama's cutting-edge FHEVM technology, enabling computation on encrypted data without ever decrypting it."
            delay={200}
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">
            How It Works
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <StepCard
            step={1}
            title="Create Vote"
            description="DAO creates a proposal by signing a transaction"
          />
          <StepCard
            step={2}
            title="Cast Vote"
            description="Users vote YES or NO — choice is encrypted client-side"
          />
          <StepCard
            step={3}
            title="Encrypted Tally"
            description="Votes are tallied homomorphically while remaining encrypted"
          />
          <StepCard
            step={4}
            title="Reveal Result"
            description="Only the final count is decrypted after voting ends"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <Card className="overflow-hidden bg-gradient-to-r from-primary/10 via-card to-accent/10">
          <CardContent className="flex flex-col items-center justify-center gap-6 py-12 text-center">
            <Shield className="h-12 w-12 text-primary" />
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              Ready to vote privately?
            </h2>
            <p className="max-w-md text-muted-foreground">
              Connect your wallet and start participating in truly private DAO governance.
            </p>
            <Button asChild size="lg" className="gap-2">
              <Link to="/votes">
                Browse Active Votes
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer spacer for mobile nav */}
      <div className="h-20 md:hidden" />
    </Layout>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <Card 
      className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardContent className="flex flex-col items-center p-6 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
          <Icon className="h-7 w-7" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function StepCard({
  step,
  title,
  description,
}: {
  step: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
        {step}
      </div>
      <h3 className="mb-2 font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
