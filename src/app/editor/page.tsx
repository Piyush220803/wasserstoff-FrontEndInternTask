import { CollaborativeEditor } from '@/components/editor/CollaborativeEditor';

export default function EditorPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">Real-Time Collaborative Editor</h1>
      <CollaborativeEditor />
    </div>
  );
}
