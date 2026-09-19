import { createFileRoute } from "@tanstack/react-router";

import { LegalPage, SectionRow } from "@/components/ui/section";

export const Route = createFileRoute("/terms")({ component: TermsPage });

function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Use"
      description="Rules and conditions governing the use of VOMLabs software and this website."
    >
      <SectionRow index="01" title="Acceptance of Terms">
        <p>
          These Terms of Use ("Terms") govern your access to and use of VOMLabs
          software and this website. By accessing, downloading, or using any
          VOMLabs software or this website, you acknowledge that you have read,
          understood, and agree to be bound by these Terms. If you do not agree
          with any provision of these Terms, you must discontinue use
          immediately.
        </p>
      </SectionRow>
      <SectionRow index="02" title="Eligibility and License">
        <p>
          VOMLabs software is made available for personal, non-commercial use
          only. Any commercial use requires prior written authorization from
          VOMLabs. To request a commercial license, please contact us by email
          or via a direct message on our Discord server.
        </p>
        <p>
          You agree to comply with all applicable laws and regulations and to
          respect the intellectual property rights of others.
        </p>
      </SectionRow>
      <SectionRow index="03" title="Acceptable Use">
        <p>You agree not to:</p>
        <ul className="list-none space-y-2">
          <li>Use VOMLabs software for any illegal or unauthorized purpose.</li>
          <li>
            Attempt to bypass, exploit, or compromise Minecraft servers,
            systems, or networks.
          </li>
          <li>
            Reverse engineer, decompile, disassemble, or otherwise tamper with
            VOMLabs software, except to the extent expressly permitted by
            applicable open source licenses.
          </li>
          <li>
            Violate Mojang AB&apos;s or Microsoft Corporation&apos;s End User
            License Agreement (EULA) or any applicable terms of service.
          </li>
        </ul>
      </SectionRow>
      <SectionRow index="04" title="No Warranty">
        <p>
          VOMLabs software is provided on an "as-is" and "as available" basis.
          To the fullest extent permitted by applicable law, VOMLabs disclaims
          all warranties, express or implied, including but not limited to the
          implied warranties of merchantability, fitness for a particular
          purpose, and non-infringement.
        </p>
      </SectionRow>
      <SectionRow index="05" title="Limitation of Liability">
        <p>
          In no event shall VOMLabs or its contributors be liable for any
          damages, whether direct, indirect, incidental, special, or
          consequential, arising out of or in connection with your use of or
          inability to use VOMLabs software, including but not limited to:
        </p>
        <ul className="list-none space-y-2">
          <li>Loss of data or corruption of data.</li>
          <li>Business interruption.</li>
          <li>Indirect or consequential damages of any kind.</li>
        </ul>
      </SectionRow>
      <SectionRow index="06" title="Intellectual Property">
        <p>
          Minecraft is a trademark of Microsoft Corporation and Mojang AB.
          VOMLabs is an independent project and is not affiliated with, endorsed
          by, or sponsored by Microsoft Corporation or Mojang AB. All
          third-party trademarks, assets, and content are the property of their
          respective owners. Most VOMLabs software and this website are open
          source. The source code and licenses are available on{" "}
          <a
            className="hover:text-foreground underline underline-offset-2"
            href="https://github.com/vomlabs"
            rel="noopener noreferrer"
            target="_blank"
          >
            GitHub
          </a>
          .
        </p>
      </SectionRow>
      <SectionRow index="07" title="Changes to Terms">
        <p>
          VOMLabs reserves the right to modify or replace these Terms at any
          time. Any changes will be effective immediately upon posting.
          Continued use of VOMLabs software or this website after such
          modifications constitutes your acceptance of the revised Terms.
        </p>
      </SectionRow>
      <SectionRow index="08" title="Termination">
        <p>
          VOMLabs reserves the right, in its sole discretion, to revoke or
          restrict your access to VOMLabs software or this website at any time,
          with or without notice, for violation of these Terms or for any other
          reason permitted by applicable law.
        </p>
      </SectionRow>
      <SectionRow index="09" title="Contact">
        <p>
          For questions or concerns regarding these Terms, please contact us at:{" "}
          <a
            className="hover:text-foreground underline underline-offset-2"
            href="mailto:legal@vomlabs.com"
          >
            legal@vomlabs.com
          </a>
          .
        </p>
      </SectionRow>
    </LegalPage>
  );
}
