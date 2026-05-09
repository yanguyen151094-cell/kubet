import Header from './components/Header';
import SimpleBanner from './components/SimpleBanner';
import SimpleContent from './components/SimpleContent';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <SimpleBanner />
        <SimpleContent />
      </main>
      <Footer />
    </div>
  );
}