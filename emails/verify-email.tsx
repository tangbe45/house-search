import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Tailwind,
} from "@react-email/components";

interface VerifyEmailProps {
  userName: string;
  verifyUrl: string;
}

const VerifyEmail = (props: VerifyEmailProps) => {
  const { userName, verifyUrl } = props;

  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Body className="bg-gray-100 font-sans py-10">
          <Container className="bg-white rounded-xl p-8 max-w-150 mx-auto">
            <Section>
              <Text className="text-[24px] font-bold text-gray-900 mb-4 mt-0">
                Verify Your Email Address
              </Text>

              <Text className="text-[16px] text-gray-700 mb-6 mt-0 leading-6">
                Thanks {userName} for signing up! Please click the button below
                to verify your email address and complete your account setup.
              </Text>

              <Section className="text-center mb-8">
                <Button
                  href={verifyUrl}
                  className="bg-blue-600 text-white px-8 py-3 rounded-[6px] text-[16px] font-medium no-underline box-border"
                >
                  Verify Email Address
                </Button>
              </Section>

              <Text className="text-[14px] text-gray-600 mb-6 mt-0 leading-5">
                If the button does&apos;t work, you can copy and paste this link
                into your browser:
                <br />
                {verifyUrl}
              </Text>

              <Text className="text-[14px] text-gray-600 mb-6 mt-0 leading-5">
                This verification link will expire in 24 hours. If you didn't
                create an account, you can safely ignore this email.
              </Text>

              <Hr className="border-gray-200 my-6" />

              <Text className="text-[12px] text-gray-500 m-0">
                © 2025 Your Company Name. All rights reserved.
              </Text>
              <Text className="text-[12px] text-gray-500 m-0">
                123 Business Street, City, State 12345
              </Text>
              <Text className="text-[12px] text-gray-500 m-0">
                <a href="#" className="text-gray-500 underline">
                  Unsubscribe
                </a>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default VerifyEmail;
