export default function AIThoughtProcess({ thoughts }: { thoughts: string }) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-2">AI DJ's Thought Process</h2>
        <p>{thoughts}</p>
      </div>
    );
  }