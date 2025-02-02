import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export const BetForm = ({ match, onSubmit }) => {
  const [prediction, setPrediction] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (/^\d+-\d+$/.test(prediction)) {
      onSubmit(prediction);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label={`Pronóstico para ${match.homeTeam} vs ${match.awayTeam}`}
        placeholder="Ej: 2-1"
        value={prediction}
        onChange={(e) => setPrediction(e.target.value)}
        error={prediction && !/^\d+-\d+$/.test(prediction) ? "Formato inválido" : null}
      />
      <Button type="submit" variant="primary">
        Apostar 🎲
      </Button>
    </form>
  );
};