import { FormEvent, useMemo, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Ambulance,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CalendarDays,
  CarFront,
  CheckCircle2,
  Clock3,
  Grid2X2,
  HandHeart,
  HeartPulse,
  House,
  Info,
  MapPin,
  Menu,
  MessageCircleMore,
  MoreVertical,
  Navigation,
  Phone,
  Send,
  ShieldCheck,
  Stethoscope,
  UserCircle,
  UsersRound,
  X,
} from 'lucide-react';

type View = 'home' | 'transport' | 'care';
type Vehicle = 'ambulance' | 'car';

const transportImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDL7_QWs8jbABiAPeD9mL7eKw-gwKS5j4QerPfJLanP3TcxdhUz_hJkolUrfDtYVDv-femY2Pcrbhvp3NAb4sDAEeCcZI_KoLBz9Si8ZEvKIVIQWG9ejtn_DLalyfmK1-J4qMzn2uU2fAsvOrqRYJKIoiziAl9rv1Sdwrw3OneLSYIpfzhFIK5ZG9TDwsY7IacdACc79NR6b9sVYZjx2SHt4JD6NutTbnRDIF8KU5kbRVlynt1S07';
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

const serviceCards = [
  { title: 'Pendampingan Pasien / Caregiver', icon: UsersRound, tone: 'pink', view: 'care' as View },
  { title: 'Pendampingan Non Pasien', icon: HandHeart, tone: 'teal', view: 'care' as View },
  { title: 'Jasa Titip & Info Antar', subtitle: 'Ke RS dan Lain-lain', icon: Navigation, tone: 'pink', view: 'transport' as View },
  { title: 'Jasa & Info Antar Jemput', subtitle: 'Ke RS dan Lain-lain', icon: Ambulance, tone: 'teal', view: 'transport' as View },
  { title: 'Deal To Pay', subtitle: '(Normal/Penawaran)', icon: HandHeart, tone: 'pink', view: 'home' as View },
  { title: 'Lainnya', icon: Grid2X2, tone: 'teal', view: 'home' as View },
];

function App() {
  const [view, setView] = useState<View>('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState('');

  const navigate = (nextView: View) => {
    setView(nextView);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 3500);
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="icon-button mobile-only" aria-label="Open menu" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
        <button className="wordmark" onClick={() => navigate('home')}>Dampingcare</button>
        <div className="topbar-actions">
          <button className="desktop-only nav-link" onClick={() => navigate('home')}>Beranda</button>
          <button className="desktop-only nav-link" onClick={() => navigate('care')}>Layanan Caregiver</button>
          <button className="desktop-only nav-link" onClick={() => navigate('transport')}>Antar Jemput</button>
          <button className="icon-button" aria-label="Profile"><UserCircle size={27} /></button>
        </div>
      </header>

      {menuOpen && <div className="mobile-menu"><button onClick={() => navigate('home')}>Beranda</button><button onClick={() => navigate('care')}>Pendampingan Pasien</button><button onClick={() => navigate('transport')}>Jasa Antar Jemput</button></div>}

      {view === 'home' && <HomeView onNavigate={navigate} />}
      {view === 'transport' && <TransportView onBack={() => navigate('home')} onToast={showToast} />}
      {view === 'care' && <CareView onBack={() => navigate('home')} onOrder={() => showToast('Permintaan pendampingan siap kami bantu.')} />}

      <BottomNav view={view} onNavigate={navigate} />
      {toast && <div className="toast"><CheckCircle2 size={18} />{toast}</div>}
    </div>
  );
}

function HomeView({ onNavigate }: { onNavigate: (view: View) => void }) {
  return (
    <main className="home-page page-width">
      <section className="home-hero">
        <div className="hero-copy"><span className="eyebrow">Dampingcare Area Solo</span><h1>Butuh<br />Pendampingan<br className="mobile-only" /> Pasien?</h1><p>Antar Jemput Pasien serta Kebutuhan Lainnya</p><div className="hero-pills"><span><ShieldCheck size={14} /> Aman</span><span><Clock3 size={14} /> Siaga</span><span><HeartPulse size={14} /> Sepenuh Hati</span></div></div>
        <div className="hero-illustration"><div className="glow-orb orb-one" /><div className="glow-orb orb-two" /><UsersRound size={124} strokeWidth={1.2} /><HeartPulse className="hero-heart" size={52} /></div>
      </section>
      <p className="welcome-copy"><strong>Hallo dengan Dampingcare^^</strong> Area Solo (Surakarta), Sukoharjo, Karanganyar, Boyolali, Sragen, Klaten, dan Yogyakarta.</p>
      <section className="service-grid">{serviceCards.map((card) => <button key={card.title} className={`service-card ${card.tone}`} onClick={() => onNavigate(card.view)}><card.icon size={46} strokeWidth={1.7} /><span>{card.title}</span>{card.subtitle && <small>{card.subtitle}</small>}<ArrowRight className="card-arrow" size={18} /></button>)}</section>
      <section className="contact-strip"><div><span className="eyebrow">Selalu siap membantu</span><h2>Perawatan yang terasa lebih manusiawi.</h2></div><button className="outline-button" onClick={() => onNavigate('care')}>Lihat layanan <ArrowRight size={18} /></button></section>
      <footer>© 2026 Dampingcare. All rights reserved.</footer>
    </main>
  );
}

function TransportView({ onBack, onToast }: { onBack: () => void; onToast: (message: string) => void }) {
  const [vehicle, setVehicle] = useState<Vehicle>('ambulance');
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [fare, setFare] = useState<number | null>(null);

  const estimatedFare = useMemo(() => vehicle === 'ambulance' ? 250000 : 125000, [vehicle]);
  const calculateFare = () => setFare(estimatedFare);

  const submitBooking = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!pickup || !destination || !date || !time) return onToast('Lengkapi lokasi, tanggal, dan waktu terlebih dahulu.');
    setSubmitting(true);
    const { error } = await supabase.from('transport_bookings').insert({ vehicle_type: vehicle, pickup_location: pickup.trim(), destination: destination.trim(), travel_date: date, travel_time: time, special_notes: notes.trim() || null, estimated_total: fare ?? estimatedFare });
    setSubmitting(false);
    if (error) return onToast('Pesanan belum tersimpan. Silakan coba lagi.');
    onToast('Pesanan berhasil dikirim. Tim kami akan segera menghubungi Anda.');
  };

  return <main className="page-width inner-page transport-page">
    <div className="subpage-header"><button className="back-button" onClick={onBack}><ArrowLeft size={20} /></button><h1>Jasa Antar Jemput</h1><button className="icon-button desktop-only"><UserCircle size={24} /></button></div>
    <div className="transport-layout">
      <section className="transport-intro">
        <div className="transport-hero" style={{ backgroundImage: `url(${transportImage})` }}><span>Transport Options</span></div>
        <h2>Select Vehicle Type</h2>
        <div className="vehicle-grid">{([['ambulance', Ambulance, 'Ambulance', 'Full Medical Support'], ['car', CarFront, 'Standard Car', 'Comfortable Transport']] as const).map(([value, Icon, label, description]) => <button key={value} className={`vehicle-card ${vehicle === value ? 'selected' : ''}`} onClick={() => { setVehicle(value); setFare(null); }}><span className="selected-check">{vehicle === value && <CheckCircle2 size={19} />}</span><Icon size={49} /><strong>{label}</strong><small>{description}</small></button>)}</div>
        <div className="included"><span className="eyebrow">Included Services</span>{['Professional Driver', 'Door-to-Door Service', 'Real-time Tracking'].map(item => <div key={item}><CheckCircle2 size={18} />{item}</div>)}</div>
      </section>
      <section className="booking-panel"><h2>Booking Details</h2><form onSubmit={submitBooking}>
        <div className="location-stack"><div className="location-row"><span className="location-icon pink"><Navigation size={16} /></span><label>Pickup Location<input value={pickup} onChange={e => setPickup(e.target.value)} placeholder="Enter current address or hospital" /></label></div><div className="location-row"><span className="location-icon teal"><MapPin size={16} /></span><label>Destination<input value={destination} onChange={e => setDestination(e.target.value)} placeholder="Enter destination address" /></label></div></div>
        <div className="field-grid"><label>Date<div className="input-with-icon"><CalendarDays size={18} /><input type="date" value={date} onChange={e => setDate(e.target.value)} /></div></label><label>Time<div className="input-with-icon"><Clock3 size={18} /><input type="time" value={time} onChange={e => setTime(e.target.value)} /></div></label></div>
        <label>Special Notes (Optional)<textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g., Wheelchair access needed" rows={3} /></label>
        <div className="fare-row"><div><span className="muted-label">Estimated Total</span><strong>{fare ? `Rp ${fare.toLocaleString('id-ID')}` : 'Rp ---'}</strong></div><button className="calculate-button" type="button" onClick={calculateFare}><Info size={16} /> Calculate Fare</button></div>
        <button className="primary-button" disabled={submitting}><Send size={20} />{submitting ? 'Mengirim...' : 'Pesan Sekarang'}</button>
      </form></section>
    </div>
  </main>;
}

function CareView({ onBack, onOrder }: { onBack: () => void; onOrder: () => void }) {
  return <main className="page-width inner-page care-page"><div className="subpage-header"><button className="back-button" onClick={onBack}><ArrowLeft size={20} /></button><h1>Pendampingan Pasien</h1><button className="icon-button"><MoreVertical size={24} /></button></div><section className="care-hero"><div><span className="eyebrow">Professional Care</span><h2>Dedicated<br />Caregiving<br />Services</h2></div><Stethoscope size={96} /></section><section className="about-card"><span className="eyebrow">About the Service</span><p>Our “Pendampingan Pasien” (Caregiver) service provides compassionate, professional, and round-the-clock assistance for individuals needing dedicated support. Whether recovering from surgery, managing a chronic illness, or requiring daily living assistance, our certified caregivers ensure safety, comfort, and peace of mind in a high-tech, responsive environment.</p></section><div className="benefit-list">{[[Clock3, '24/7 Availability', 'Round-the-clock support tailored to patient schedules.'], [ShieldCheck, 'Certified Caregivers', 'Highly trained professionals with verified medical backgrounds.'], [HeartPulse, 'Real-time Monitoring', 'Continuous health tracking synced with the Dampingcare app.']].map(([Icon, title, body], index) => <div className={`benefit-card benefit-${index}`} key={title as string}><span className="benefit-icon"><Icon size={20} /></span><strong>{title as string}</strong><p>{body as string}</p></div>)}</div><button className="primary-button care-cta" onClick={onOrder}>Order Care Now <ArrowRight size={21} /></button><small className="care-note">Contact us for custom care packages.</small></main>;
}

function BottomNav({ view, onNavigate }: { view: View; onNavigate: (view: View) => void }) {
  return <nav className="bottom-nav"><button className={view === 'home' ? 'active' : ''} onClick={() => onNavigate('home')}><House size={22} /><span>Home</span></button><button className={view !== 'home' ? 'active' : ''} onClick={() => onNavigate('transport')}><Grid2X2 size={22} /><span>Services</span></button><button onClick={() => window.location.href = 'tel:+62271234567'}><Phone size={22} /><span>Call</span></button><button onClick={() => onNavigate('care')}><Bookmark size={22} /><span>Care</span></button></nav>;
}

export default App;
