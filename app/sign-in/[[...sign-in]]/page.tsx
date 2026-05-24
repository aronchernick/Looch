import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: "#1B3A5C" }}
    >
      <div className="mb-8 text-center">
        <div className="text-white font-extrabold text-3xl tracking-tight">Looch</div>
        <div className="text-blue-200 text-sm mt-1">Jewish Family Calendar</div>
      </div>
      <SignIn
        appearance={{
          variables: {
            colorPrimary: "#6B1A1A",
            colorBackground: "#FAFAF7",
            fontFamily: "Nunito, sans-serif",
            borderRadius: "12px",
          },
        }}
      />
    </div>
  );
}
