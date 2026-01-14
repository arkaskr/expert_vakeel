// src/pages/pricing.tsx
import React, { memo } from "react";
import CTA from "../components/CTA";

const Pricing: React.FC = memo(() => {
  return (
    <div className="pricing-wrap p-responsive">
      {/* Header */}
      <section className="pricing-hero text-center mb-responsive">
        <h1 className="pricing-heading heading-responsive">Plan that suits everyone!</h1>
        <p className="pricing-desc text-responsive">
          We offer our services to a range of client base including those dealing with
          commerce and industry. Our beneficiaries in criminal litigation cases also
          include different multinational corporations, public sector bodies, and
          individual business owners.
        </p>
      </section>

      {/* Cards */}
      <section className="pricing-grid grid-responsive-2 gap-responsive">
        {/* BASIC */}
        <article className="card card-basic card-responsive">
          <header className="card-top flex-between">
            <div>
              <h3 className="plan-title">
                Legal Network <span className="plan-accent">Basic</span>
              </h3>
              <p className="plan-sub">Best For Starting & Setting Up Things</p>
            </div>
            
          </header>

          <ul className="feat">
            <li>Create Profile On Legal Network</li>
            <li>Get Listed On Expert Vakeel</li>
            <li>Chat With Unlimited Profiles</li>
            <li>Operate Legal Diary & Legal News</li>
            <li>Ask & Answer Queries</li>
            <li>Valid Upto 12 Months</li>
          </ul>

          <footer className="price">
            <span>Free For 12 Months</span>
          </footer>
        </article>

        {/* PRO */}
        <article className="card card-pro card-responsive">
          <header className="card-top flex-between">
            <div>
              <h3 className="plan-title">
                Legal Network <span className="plan-pro">Pro</span>
              </h3>
              <p className="plan-sub">Best For Starting & Setting Up Things</p>
            </div>
          
          </header>

          <ul className="feat">
            <li>All Included In Basic Plan</li>
            <li>Get Verified Mark On Your Profile</li>
            <li>Get Sponsored In Search Results</li>
            <li>Get Featured In Our Trusted Profiles</li>
            <li>Get Leads From Expert Vakeel</li>
            <li>Valid Upto 12 Months</li>
          </ul>

          <footer className="price text-center">
            <div>
              <strong>INR 999/- Per Month</strong>
              <div className="billed">Billed Yearly</div>
            </div>
          </footer>
        </article>
      </section>
            {/* CTA Component */}
            <CTA />
    </div>
  );
});

Pricing.displayName = "Pricing";
export default Pricing;
