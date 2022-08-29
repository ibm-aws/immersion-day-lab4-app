import './App.scss';
import { Content } from '@carbon/react';
import AppHeader from './components/AppHeader';
import LandingPage from './content/LandingPage';

function App() {
  return (
    <>
      <AppHeader />
      <Content>
        <LandingPage></LandingPage>
      </Content>
    </>
  );
}

export default App;
