import './styles.css';

const storybookUrl = `${import.meta.env.BASE_URL}storybook/`;

export function App() {
  return (
    <>
      <header>
        <p>Erica Gugliemella</p>
      </header>
      <main>
        <h1>Portfolio</h1>
        <p>About and resume will live here.</p>
        <p>
          <a href={storybookUrl}>Design system in Storybook</a>
        </p>
      </main>
    </>
  );
}
