import { LoginForm } from "../../components/auth/LoginForm";

export const Login = () => {
  return (
    <div className="h-screen flex items-center md:justify-between justify-center">
      <div className="w-1/2 md:flex hidden bg-blue-300 h-full items-center justify-center">
        <img
          src="/auth.jpg"
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center h-full relative">
        <LoginForm />
        <div className="absolute top-1 left-1 w-40 h-40 border-10 border-blue-500 rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 border-10 border-blue-500 rounded-tr-3xl"></div>
        <div className="absolute top-0 right-0 w-40 h-40 border-10 border-blue-500 rounded-bl-3xl"></div>
        <div className="absolute bottom-1 right-1 w-40 h-40 border-10 border-blue-500 rounded-full"></div>
      </div>
    </div>
  );
};
