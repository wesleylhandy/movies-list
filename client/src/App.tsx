import { MovieModal } from "./components/MovieModal";
import { Movies } from "./components/Movies";


function App() {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-600 min-h-screen flex flex-col">
      <header className="flex flex-col justify-center items-center context-center h-32 my-5">
        <h1 className="font-heading text-center text-7xl text-gray-300">Now Playing</h1>
      </header>
      <Movies />
      <MovieModal />
    </div>
  );
}

export default App;
