import { Note } from "../interfaces";

interface TextareaProps {
  textFile?: Note;
  setTextFile: (textFile: Note) => void;
  saving: boolean;
}

export default function Textarea({
  textFile,
  setTextFile,
  saving,
}: TextareaProps) {
  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      <div className="flex flex-row justify-between py-2 px-1 space-x-5 text-gray-400 text-xs">
        <div>{saving ? "Saving..." : "Saved"}</div>
        <div>{textFile ? textFile.content.length : 0} characters</div>
      </div>
      {textFile && (
        <div className="flex flex-col w-full h-full border rounded-lg border-gray-700">
          <div className="flex flex-col px-4 py-2 m-1 space-y-1 h-full rounded-t-lg bg-gray-800">
            <input
              type="text"
              className="text-2xl font-bold text-gray-300 bg-gray-800 outline-none"
              value={textFile.title}
              onInput={(e) =>
                setTextFile({ ...textFile, title: e.currentTarget.value })
              }
            />
            <textarea
              id="comment"
              className="w-full h-full pb-5 rounded-lg text-sm resize-none focus:outline-none bg-gray-800 text-white placeholder-gray-400 overflow-y-auto"
              placeholder="Type away..."
              value={textFile.content}
              onInput={(e) =>
                setTextFile({ ...textFile, content: e.currentTarget.value })
              }
            ></textarea>
          </div>
        </div>
      )}
    </div>
  );
}
