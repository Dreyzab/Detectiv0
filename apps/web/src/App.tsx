import { Button } from './shared/ui/Button';

function App() {
  return (
    <div className="min-h-screen bg-background text-white p-4">
      <h1 className="text-2xl font-bold mb-4">Grezwanderer 4</h1>
      <Button onClick={() => alert('Clicked!')}>Start Game</Button>
    </div>
  );
}

export default App;
