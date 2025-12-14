import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

interface ForgotPasswordEmailProp {
  userName: string;
  userEmail: string;
  resetLink: string;
}

const ForgotPasswordEmail = (props: ForgotPasswordEmailProp) => {
  const { userName, resetLink, userEmail } = props;

  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>Reset your password - Action required</Preview>
        <Body className="bg-gray-100 font-sans py-10">
          <Container className="bg-white rounded-xl shadow-sm max-w-145 mx-auto p-10">
            {/* Header */}
            <Section className="text-center mb-8">
              <Heading className="text-[28px] font-bold text-gray-900 m-0 mb-2">
                Reset Your Password
              </Heading>
              <Text className="text-[16px] text-gray-600 m-0">
                We received a request to reset your password
              </Text>
            </Section>

            {/* Main Content */}
            <Section className="mb-8">
              <Text className="text-[16px] text-gray-700 leading-6 m-0 mb-4">
                Hello, {userName}
              </Text>
              <Text className="text-[16px] text-gray-700 leading-6 m-0 mb-4">
                We received a request to reset the password for your account
                associated with <strong>{userEmail}</strong>.
              </Text>
              <Text className="text-[16px] text-gray-700 leading-6 m-0 mb-6">
                Click the button below to create a new password. This link will
                expire in 24 hours for security reasons.
              </Text>
            </Section>

            {/* Reset Button */}
            <Section className="text-center mb-8">
              <Button
                href={resetLink}
                className="bg-blue-600 text-white text-[16px] font-semibold py-3 px-6 rounded-[6px] no-underline box-border hover:bg-blue-700"
              >
                Reset Password
              </Button>
            </Section>

            {/* Alternative Link */}
            <Section className="mb-8">
              <Text className="text-[14px] text-gray-600 leading-5 m-0 mb-4">
                If the button doesn&apos;t work, copy and paste this link into
                your browser:
              </Text>
              <Text className="text-[14px] text-blue-600 break-all m-0">
                <Link href={resetLink} className="text-blue-600 underline">
                  {resetLink}
                </Link>
              </Text>
            </Section>

            {/* Security Notice */}
            <Section className="bg-gray-50 p-5 rounded-[6px] mb-8">
              <Text className="text-[14px] text-gray-700 leading-5 m-0 mb-3 font-semibold">
                Security Notice:
              </Text>
              <Text className="text-[14px] text-gray-600 leading-4 m-0 mb-2">
                • If you didn't request this password reset, please ignore this
                email
              </Text>
              <Text className="text-[14px] text-gray-600 leading-5 m-0 mb-2">
                • This link will expire in 24 hours
              </Text>
              <Text className="text-[14px] text-gray-600 leading-5 m-0">
                • For security, this request was made from your registered
                device
              </Text>
            </Section>

            {/* Footer */}
            <Section className="border-t border-gray-200 pt-6">
              <Text className="text-[14px] text-gray-600 leading-5 m-0 mb-2">
                Need help? Contact our support team at{" "}
                <Link
                  href="mailto:support@company.com"
                  className="text-blue-600 underline"
                >
                  support@company.com
                </Link>
              </Text>
              <Text className="text-[12px] text-gray-500 m-0 mb-2">
                Company Name, 123 Business Street, City, State 12345
              </Text>
              <Text className="text-[12px] text-gray-500 m-0">
                © 2025 Company Name. All rights reserved.{" "}
                <Link href="#" className="text-gray-500 underline">
                  Unsubscribe
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ForgotPasswordEmail;
