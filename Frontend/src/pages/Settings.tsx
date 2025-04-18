import useSessions from "../hooks/useSessions";
import SessionCard from "../components/SessionCard";

export type Session = {
  _id: string;
  expiresAt: Date;
  createdAt: Date;
  isCurrent: Boolean;
  userAgent: string;
};

const Settings = () => {
  const { sessions } = useSessions();

  return (
    <div className="w-[50%] h-[70%] flex flex-col gap-5 overflow-auto">
      <h1 className="text-2xl font-bold w-full text-center">My Sessions</h1>

      {sessions?.map((session: Session) => {
        return <SessionCard key={session._id} session={session} />;
      })}
    </div>
  );
};
export default Settings;
