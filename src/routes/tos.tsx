import { createFileRoute } from "@tanstack/react-router";

import { LegalPage, SectionRow } from "@/components/ui/section";

export const Route = createFileRoute("/tos")({ component: TosPage });

function TosPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      description="Rules and expectations for using VOMLabs software and this website."
    >
      <SectionRow index="01" title="Acceptance of Terms">
        <p>
          These Terms of Service ("TOS") explain the rules and expectations for
          using VOMLabs software and this website. By accessing or using VOMLabs
          software, you agree to abide by these Terms of Service.
        </p>
      </SectionRow>
      <SectionRow index="02" title="Eligibility">
        <p>
          VOMLabs software is made available for personal, non-commercial use.
          Commercial use requires prior written authorization from VOMLabs. To
          request a commercial license, please contact us by email or via
          Discord.
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
            Reverse engineer, decompile, or tamper with VOMLabs software beyond
            what open source licenses expressly permit.
          </li>
          <li>
            Violate Mojang AB&apos;s or Microsoft Corporation&apos;s End User
            License Agreement (EULA).
          </li>
        </ul>
      </SectionRow>
      <SectionRow index="04" title="No Warranty">
        <p>
          VOMLabs software is provided on an "as-is" and "as available" basis.
          To the fullest extent permitted by law, VOMLabs disclaims all
          warranties, express or implied, including merchantability, fitness for
          a particular purpose, and non-infringement.
        </p>
      </SectionRow>
      <SectionRow index="05" title="Limitation of Liability">
        <p>
          In no event shall VOMLabs or its contributors be liable for any
          damages arising from your use or inability to use VOMLabs software,
          including loss of data, business interruption, or indirect or
          consequential damages.
        </p>
      </SectionRow>
      <SectionRow index="06" title="Intellectual Property">
        <p>
          Minecraft is a trademark of Microsoft Corporation and Mojang AB.
          VOMLabs is an independent project and is not affiliated with, endorsed
          by, or sponsored by Microsoft or Mojang. Most VOMLabs software and
          this website are open source.
        </p>
      </SectionRow>
      <SectionRow index="07" title="Changes to TOS">
        <p>
          VOMLabs may update these Terms of Service at any time. Continued use
          after changes constitutes acceptance of the revised TOS.
        </p>
      </SectionRow>
      <SectionRow index="08" title="Termination">
        <p>
          VOMLabs reserves the right to revoke or restrict access to its
          software or website at any time for violation of these TOS or any
          other reason.
        </p>
      </SectionRow>
      <SectionRow index="09" title="Contact">
        <p>
          For questions about these Terms of Service, contact us at:{" "}
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
