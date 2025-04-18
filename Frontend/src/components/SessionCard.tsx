import { Button, CircularProgress, Divider } from "@mui/material";
import useDeleteSession from "../hooks/useDeleteSession";
import { Session } from "../pages/Settings";

const SessionCard = ({ session }: { session: Session }) => {
  const { _id, expiresAt, createdAt, isCurrent, userAgent } = session;
  const { deleteSession, isPending } = useDeleteSession(_id);

  return (
    <div className={`flex flex-between p-2 gap-5`}>
      <div className="flex flex-col gap-1 w-[80%]">
        <div>
          <span className="font-bold text-md">user : </span>
          <span className="">{_id}</span>
        </div>
        <div>
          <span className="font-bold text-md">limit : </span>
          <span className="">
            {new Date(expiresAt).toLocaleDateString("en-US")}
          </span>
        </div>
        <div className="">
          <span className="font-bold text-md">device : </span>
          <p className="text-xs text-gray-400">{userAgent}</p>
        </div>
      </div>

      {isCurrent ? (
        <p className="text-blue-400 text-sm text-center w-[20%]">
          current session
        </p>
      ) : (
        <Button
          color="secondary"
          size="small"
          sx={{
            width: "20%",
            height: "2rem",
            fontSize: "0.75rem",
          }}
          onClick={() => {
            deleteSession();
          }}
          disabled={isPending}
        >
          {isPending ? (
            <CircularProgress size={16} color="secondary" />
          ) : (
            "delete session"
          )}
        </Button>
      )}

      <Divider />
    </div>
  );
};
export default SessionCard;

// faizan@gmail.com
// 123456
