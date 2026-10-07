import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, doc, addDoc, updateDoc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { Heart, MapPin, Utensils, Music, Wine, Church, Camera, GripVertical, Settings, X, Plus, Trash2, Lock, Unlock } from 'lucide-react';

const theme = {
  cream: '#FDFBF7',
  beige: '#F4F1EA',
  sage: '#7C8B72',
  sageDark: '#5E6B55',
  text: '#4A4A48',
  textLight: '#8A8A88'
};

// CHANGE THIS TO YOUR DESIRED ADMIN PASSWORD
const ADMIN_PASSWORD = "Admin10!";

const GlobalStyles = () => (
  <style dangerouslySetInnerHTML={{
    __html: `
    .font-script { font-family: 'Great Vibes', cursive; }
    .font-serif { font-family: 'Cormorant Garamond', serif; }
    
    .torn-paper-top {
      position: relative;
      background: ${theme.cream};
    }
    .torn-paper-top::before {
      content: "";
      position: absolute;
      top: -20px;
      left: 0;
      width: 100%;
      height: 20px;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 20' preserveAspectRatio='none'%3E%3Cpath d='M0,20 L1200,20 L1200,5 C1150,15 1100,0 1050,10 C1000,20 950,5 900,15 C850,5 800,20 750,10 C700,0 650,15 600,5 C550,20 500,10 450,20 C400,0 350,15 300,5 C250,20 200,10 150,20 C100,5 50,15 0,5 Z' fill='%23FDFBF7'/%3E%3C/svg%3E");
      background-size: 100% 100%;
      z-index: 10;
    }
      
    .divider-leaf {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 2rem 0;
      color: ${theme.sage};
    }
    .divider-leaf::before, .divider-leaf::after {
      content: "";
      height: 1px;
      width: 60px;
      background-color: ${theme.sage};
      margin: 0 15px;
    }
  `}} />
);

const RSVPForm = () => {
  const [name, setName] = useState('');
  const [attending, setAttending] = useState('yes');
  const [food, setFood] = useState('beef');
  const [music, setMusic] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const guestsRef = collection(db, 'guests');
      await addDoc(guestsRef, {
        name,
        attending: attending === 'yes',
        foodChoice: attending === 'yes' ? food : 'none',
        musicRequest: music.trim(),
        message: message.trim(),
        table: null,
        timestamp: new Date()
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting RSVP:", error);
      alert("There was an error saving your RSVP. Please try again.");
    }
  };

  if (submitted) return (
    <div className="text-center p-8 border rounded-lg bg-white/50 border-[#7C8B72]/20">
      <Heart className="w-8 h-8 mx-auto mb-4" style={{ color: theme.sage }} />
      <h3 className="font-serif text-2xl mb-2" style={{ color: theme.text }}>Thank You!</h3>
      <p style={{ color: theme.textLight }}>Your RSVP has been recorded.</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto p-6 bg-white shadow-sm border border-[#F4F1EA] rounded-xl text-left">
      <div>
        <label className="block font-serif text-lg mb-2" style={{ color: theme.text }}>Guest Name</label>
        <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 bg-[#FDFBF7] border border-[#E5E0D8] rounded-md outline-none focus:border-[#7C8B72] font-serif transition-colors"
          placeholder="Full Name" />
      </div>
      <div>
        <label className="block font-serif text-lg mb-2" style={{ color: theme.text }}>Will you attend?</label>
        <div className="flex gap-4">
          <label className="flex-1 cursor-pointer">
            <input type="radio" name="attending" value="yes" checked={attending === 'yes'} onChange={() => setAttending('yes')} className="sr-only peer" />
            <div className="text-center py-3 border border-[#E5E0D8] rounded-md peer-checked:bg-[#7C8B72] peer-checked:text-white font-serif transition-all">Accept</div>
          </label>
          <label className="flex-1 cursor-pointer">
            <input type="radio" name="attending" value="no" checked={attending === 'no'} onChange={() => setAttending('no')} className="sr-only peer" />
            <div className="text-center py-3 border border-[#E5E0D8] rounded-md peer-checked:bg-[#E5E0D8] peer-checked:text-[#4A4A48] font-serif transition-all">Decline</div>
          </label>
        </div>
      </div>
      {attending === 'yes' && (
        <>
          <div>
            <label className="block font-serif text-lg mb-2" style={{ color: theme.text }}>Menu Choice</label>
            <select value={food} onChange={(e) => setFood(e.target.value)} className="w-full px-4 py-3 bg-[#FDFBF7] border border-[#E5E0D8] rounded-md outline-none focus:border-[#7C8B72] font-serif">
              <option value="beef">Beef Filet</option>
              <option value="chicken">Roasted Chicken</option>
              <option value="vegan">Vegan / Vegetarian</option>
            </select>
          </div>
          <div>
            <label className="block font-serif text-lg mb-2" style={{ color: theme.text }}>Song Request (Optional)</label>
            <input type="text" value={music} onChange={(e) => setMusic(e.target.value)}
              className="w-full px-4 py-3 bg-[#FDFBF7] border border-[#E5E0D8] rounded-md outline-none focus:border-[#7C8B72] font-serif transition-colors"
              placeholder="I will definitely dance if you play..." />
          </div>
        </>
      )}
      <div>
        <label className="block font-serif text-lg mb-2" style={{ color: theme.text }}>Message for the Bride and Groom (This will remain hidden unti after the wedding)</label>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows="3"
          className="w-full px-4 py-3 bg-[#FDFBF7] border border-[#E5E0D8] rounded-md outline-none focus:border-[#7C8B72] font-serif transition-colors resize-none"
          placeholder="Leave a note, advice, or well wishes!" />
      </div>
      <button type="submit" className="w-full py-3 text-white rounded-md font-serif text-xl tracking-wide transition-opacity hover:opacity-90" style={{ backgroundColor: theme.sage }}>
        Submit RSVP
      </button>
    </form>
  );
};

const AdminLogin = ({ onLogin, onCancel }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onLogin();
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6 font-serif">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-[#E5E0D8] max-w-sm w-full text-center">
        <Settings className="w-10 h-10 mx-auto mb-4" style={{ color: theme.sage }} />
        <h2 className="text-3xl font-script mb-6" style={{ color: theme.text }}>Admin Access</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#FDFBF7] border border-[#E5E0D8] rounded-md outline-none focus:border-[#7C8B72] text-center"
              placeholder="Enter password" autoFocus />
            {error && <p className="text-red-400 text-sm mt-2">Incorrect password</p>}
          </div>
          <button type="submit" className="w-full py-3 text-white rounded-md text-xl tracking-wide" style={{ backgroundColor: theme.sage }}>
            Login
          </button>
          <button type="button" onClick={onCancel} className="w-full py-2 text-[#8A8A88] hover:text-[#4A4A48] text-sm tracking-widest uppercase">
            Return to Website
          </button>
        </form>
      </div>
    </div>
  );
};

const GuestView = ({ setView }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const weddingDate = new Date("2027-06-26T15:00:00").getTime();
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = weddingDate - now;
      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col w-full max-w-lg mx-auto bg-white shadow-xl overflow-hidden relative">
      <button onClick={() => setView('admin')} className="absolute top-4 right-4 z-50 p-2 text-white/50 hover:text-white transition-colors">
        <Settings size={18} />
      </button>

      <div className="relative h-[600px] w-full bg-gray-900 flex items-end justify-center pb-16">
        <img src="./imgs/main.jpg" alt="Couple" className="absolute inset-0 w-full h-full object-cover opacity-60" />
        <div className="relative z-10 text-center text-white p-6">
          <p className="font-serif tracking-widest text-sm mb-4 uppercase letter-spacing-2">Welcome to our wedding</p>
          <h1 className="font-script text-7xl mb-4 drop-shadow-md">Afton & Danny</h1>
          <p className="font-serif text-xl tracking-widest">26.06.2027</p>
        </div>
      </div>

      <div className="torn-paper-top pb-16 px-6" style={{ backgroundColor: theme.cream }}>
        <div className="flex justify-center gap-6 pt-12 pb-6 border-b border-[#E5E0D8]/60 max-w-sm mx-auto">
          {Object.entries(timeLeft).map(([unit, value]) => (
            <div key={unit} className="text-center w-20">
              <div className="font-serif text-4xl tabular-nums" style={{ color: theme.sage }}>
                {value.toString().padStart(2, '0')}
              </div>
              <div className="font-serif text-xs uppercase tracking-widest" style={{ color: theme.textLight }}>{unit}</div>
            </div>
          ))}
        </div>
        <div className="divider-leaf"></div>
        <div className="space-y-12 text-center">
          <div className="flex flex-col items-center">
            <Church size={32} strokeWidth={1} style={{ color: theme.sage }} className="mb-4" />
            <h2 className="font-script text-5xl mb-2" style={{ color: theme.text }}>Ceremony</h2>
            <p className="font-serif text-xl mb-1" style={{ color: theme.text }}>14:00</p>
            <p className="font-serif text-sm tracking-wide uppercase mb-4" style={{ color: theme.textLight }}>TBD<br />TBD</p>
          </div>
          <div className="w-16 h-px bg-[#E5E0D8] mx-auto"></div>
          <div className="flex flex-col items-center">
            <Wine size={32} strokeWidth={1} style={{ color: theme.sage }} className="mb-4" />
            <h2 className="font-script text-5xl mb-2" style={{ color: theme.text }}>Reception</h2>
            <p className="font-serif text-xl mb-1" style={{ color: theme.text }}>16:00</p>
            <p className="font-serif text-sm tracking-wide uppercase mb-4" style={{ color: theme.textLight }}>TBD<br />TBD</p>
          </div>
        </div>
      </div>

      <div className="relative h-[400px] w-full">
        <img src="./imgs/second.jpg" alt="Affy" className="absolute inset-0 w-full h-full object-cover opacity-100" />
      </div>

      <div className="torn-paper-top pb-24 px-6" style={{ backgroundColor: theme.cream }}>
        <div className="pt-16 pb-8 max-w-xs mx-auto">
          <h2 className="font-script text-5xl text-center mb-10" style={{ color: theme.text }}>The Wedding Day</h2>
          <div className="relative border-l border-[#7C8B72]/30 ml-4 space-y-10 py-2">
            {[
              { time: '15:00', event: 'Location arrival', icon: MapPin },
              { time: '16:00', event: 'Ceremony', icon: Church },
              { time: '17:00', event: 'Toast', icon: Wine },
              { time: '18:30', event: 'Dinner', icon: Utensils },
              { time: '21:00', event: 'Party', icon: Music },
            ].map((item, i) => (
              <div key={i} className="relative pl-10">
                <div className="absolute -left-[18px] top-1 bg-[#FDFBF7] p-1">
                  <item.icon size={24} strokeWidth={1} style={{ color: theme.sage }} />
                </div>
                <h4 className="font-serif text-xl" style={{ color: theme.text }}>{item.time}</h4>
                <p className="font-serif text-[#8A8A88]">{item.event}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center pt-8 border-t border-[#E5E0D8]/60 mt-12">
          <Music size={28} strokeWidth={1} style={{ color: theme.sage }} className="mx-auto mb-4" />
          <h3 className="font-script text-5xl mb-8" style={{ color: theme.text }}>RSVP</h3>
          <RSVPForm />
        </div>
      </div>
    </div>
  );
};

const AdminView = ({ guests, tables, setView }) => {
  const [activeTab, setActiveTab] = useState('seating');
  const [draggedGuestId, setDraggedGuestId] = useState(null);

  // New states for the smooth inline password unlock
  const [guestbookUnlocked, setGuestbookUnlocked] = useState(false);
  const [showUnlockInput, setShowUnlockInput] = useState(false);
  const [unlockPassword, setUnlockPassword] = useState('');

  const attendingGuests = guests.filter(g => g.attending);
  const declinedGuests = guests.filter(g => !g.attending);
  const musicRequests = attendingGuests.filter(g => g.musicRequest && g.musicRequest.trim() !== '');
  const guestMessages = guests.filter(g => g.message && g.message.trim() !== '');

  const weddingDate = new Date("2027-06-26T15:00:00");
  const isWeddingPassed = new Date() > weddingDate;
  const isGuestbookVisible = isWeddingPassed || guestbookUnlocked;

  // Replaced the glitchy prompt() with a standard React function
  const handleEarlyUnlock = () => {
    if (unlockPassword === ADMIN_PASSWORD) {
      setGuestbookUnlocked(true);
      setShowUnlockInput(false);
    } else {
      alert("Incorrect password.");
      setUnlockPassword('');
    }
  };

  const handleDragStart = (e, guestId) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData('guestId', guestId);
    setDraggedGuestId(guestId);
  };

  const handleDrop = async (e, targetTable) => {
    e.preventDefault();
    const guestId = e.dataTransfer.getData('guestId');
    setDraggedGuestId(null);
    if (!guestId) return;
    try {
      await updateDoc(doc(db, 'guests', guestId), { table: targetTable === 'unassigned' ? null : targetTable });
    } catch (error) { console.error("Error updating seating:", error); }
  };

  const handleSelectTable = async (guestId, targetTable) => {
    try {
      await updateDoc(doc(db, 'guests', guestId), { table: targetTable === 'unassigned' ? null : targetTable });
    } catch (error) { console.error("Error updating seating:", error); }
  };

  const deleteGuest = async (guestId) => {
    if (!window.confirm("Delete this RSVP?")) return;
    try { await deleteDoc(doc(db, 'guests', guestId)); }
    catch (e) { console.error(e); }
  };

  const removeMessage = async (guestId) => {
    if (!window.confirm("Remove this guest's message? (The rest of their RSVP will be saved)")) return;
    try { await updateDoc(doc(db, 'guests', guestId), { message: '' }); }
    catch (e) { console.error(e); }
  };

  const addTable = async () => {
    try { await addDoc(collection(db, 'tables'), { name: `Table ${tables.length + 1}`, createdAt: new Date() }); }
    catch (error) { console.error("Error adding table:", error); }
  };

  const updateTableName = async (tableId, newName) => {
    try { await updateDoc(doc(db, 'tables', tableId), { name: newName }); }
    catch (error) { console.error("Error renaming table:", error); }
  };

  const deleteTable = async (tableId) => {
    if (!window.confirm("Delete this table? Guests will be moved to Unassigned.")) return;
    try {
      guests.filter(g => g.table === tableId).forEach(g => {
        updateDoc(doc(db, 'guests', g.id), { table: null });
      });
      await deleteDoc(doc(db, 'tables', tableId));
    } catch (error) { console.error("Error deleting table:", error); }
  };

  const GuestCard = ({ guest }) => (
    <div
      draggable="true"
      onDragStart={(e) => handleDragStart(e, guest.id)}
      onDragEnd={() => setDraggedGuestId(null)}
      className={`p-3 mb-2 bg-white rounded-md shadow-sm border border-gray-200 flex flex-col gap-2 cursor-move hover:border-[#7C8B72] transition-all ${draggedGuestId === guest.id ? 'opacity-40 border-dashed' : ''}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="font-serif font-bold text-gray-800 leading-tight">{guest.name}</p>
          <p className="text-xs text-gray-500 capitalize flex items-center gap-1 mt-1 font-serif">
            <Utensils className="w-3 h-3" /> {guest.foodChoice}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => deleteGuest(guest.id)} className="text-red-400 hover:text-red-600 p-1"><X size={14} /></button>
          <GripVertical className="text-gray-300 w-4 h-4 hidden sm:block" />
        </div>
      </div>

      <select
        value={guest.table || 'unassigned'}
        onChange={(e) => handleSelectTable(guest.id, e.target.value)}
        className="w-full text-xs font-serif p-1 bg-gray-50 border border-gray-200 rounded text-gray-600 sm:hidden"
      >
        <option value="unassigned">Unassigned</option>
        {tables.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
      </select>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-serif">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-4xl font-script" style={{ color: theme.sage }}>Admin Dashboard</h2>
          <button onClick={() => setView('guest')} className="px-6 py-2 bg-white rounded-full shadow-sm border font-serif flex items-center gap-2 hover:bg-gray-50">
            Back to Website
          </button>
        </div>

        <div className="flex flex-wrap gap-2 md:gap-4 mb-6 border-b border-gray-200">
          {[
            { id: 'seating', label: `Seating (${attendingGuests.length})` },
            { id: 'declined', label: `Declined (${declinedGuests.length})` },
            { id: 'music', label: `Music Requests (${musicRequests.length})` },
            { id: 'guestbook', label: `Time Capsule (${guestMessages.length})` },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-2 font-serif text-lg border-b-2 transition-colors ${activeTab === tab.id ? 'border-[#7C8B72] text-[#4A4A48]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'seating' && (
          <div className="grid lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 bg-white rounded-xl p-4 shadow-sm border border-gray-200 min-h-[500px]"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, 'unassigned')}
            >
              <div className="border-b pb-3 mb-4">
                <h3 className="text-xl font-bold text-gray-800">Unassigned</h3>
                <p className="text-sm text-gray-500">{attendingGuests.filter(g => !g.table).length} Guests to seat</p>
              </div>
              <div className="space-y-2 h-[calc(100%-4rem)] overflow-y-auto pr-2">
                {attendingGuests.filter(g => !g.table).map(guest => <GuestCard key={guest.id} guest={guest} />)}
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {tables.map((table) => {
                  const tableGuests = attendingGuests.filter(g => g.table === table.id);
                  return (
                    <div key={table.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 min-h-[250px] flex flex-col"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDrop(e, table.id)}
                    >
                      <div className="flex justify-between items-start border-b pb-2 mb-3">
                        <input type="text" value={table.name} onChange={(e) => updateTableName(table.id, e.target.value)}
                          className="font-bold text-lg text-gray-800 bg-transparent border-none outline-none focus:ring-2 focus:ring-[#7C8B72]/30 rounded px-1 w-2/3"
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-1 bg-[#F4F1EA] rounded-full" style={{ color: theme.sageDark }}>{tableGuests.length}</span>
                          <button onClick={() => deleteTable(table.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                        </div>
                      </div>
                      <div className="space-y-2 flex-grow">
                        {tableGuests.map(guest => <GuestCard key={guest.id} guest={guest} />)}
                        {tableGuests.length === 0 && (
                          <div className="flex items-center justify-center h-20 text-gray-400 border-2 border-dashed border-gray-100 rounded-lg italic text-sm">
                            Drop guest here
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                <button onClick={addTable} className="border-2 border-dashed border-[#7C8B72]/40 rounded-xl p-4 min-h-[250px] flex flex-col items-center justify-center text-[#7C8B72] hover:bg-[#7C8B72]/5 transition-colors">
                  <Plus size={32} className="mb-2" />
                  <span className="font-serif text-lg font-bold">Add Table</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'declined' && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-2xl font-script mb-4" style={{ color: theme.sage }}>Respectfully Declined</h3>
            {declinedGuests.length === 0 ? (
              <p className="text-gray-500 italic">No declined RSVPs yet.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {declinedGuests.map(guest => (
                  <li key={guest.id} className="py-3 flex justify-between items-center">
                    <span className="font-bold text-gray-800">{guest.name}</span>
                    <button onClick={() => deleteGuest(guest.id)} className="text-red-400 hover:text-red-600"><X size={16} /></button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === 'music' && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-2xl font-script mb-4" style={{ color: theme.sage }}>Guest Song Requests</h3>
            {musicRequests.length === 0 ? (
              <p className="text-gray-500 italic">No song requests yet.</p>
            ) : (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {musicRequests.map(guest => (
                  <div key={guest.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">{guest.name} requested:</p>
                    <p className="font-bold text-gray-800">"{guest.musicRequest}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'guestbook' && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-2xl font-script" style={{ color: theme.sage }}>Time Capsule Guestbook</h3>
              {!isGuestbookVisible && !showUnlockInput && (
                <button onClick={() => setShowUnlockInput(true)} className="flex items-center gap-2 text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-700">
                  <Unlock size={14} /> Unlock Early
                </button>
              )}

              {/* The smooth inline password input */}
              {!isGuestbookVisible && showUnlockInput && (
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    value={unlockPassword}
                    onChange={(e) => setUnlockPassword(e.target.value)}
                    placeholder="Enter password"
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md outline-none focus:border-[#7C8B72]"
                  />
                  <button onClick={handleEarlyUnlock} className="px-3 py-1 text-sm text-white rounded-md bg-[#7C8B72] hover:bg-[#5E6B55] transition-colors">
                    Submit
                  </button>
                  <button onClick={() => setShowUnlockInput(false)} className="px-2 py-1 text-gray-400 hover:text-gray-600">
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            {!isGuestbookVisible ? (
              <div className="text-center py-16 px-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <Lock size={48} className="mx-auto mb-4 text-gray-300" />
                <h4 className="text-xl font-serif text-gray-700 mb-2">Sealed until June 26, 2027</h4>
                <p className="text-gray-500 font-serif max-w-md mx-auto">
                  Guests are leaving notes, but they are locked away until after the wedding day.
                </p>
              </div>
            ) : guestMessages.length === 0 ? (
              <p className="text-gray-500 italic">No messages left yet.</p>
            ) : (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                {guestMessages.map(guest => (
                  <div key={guest.id} className="p-5 bg-[#FDFBF7] rounded-xl border border-[#E5E0D8] shadow-sm relative group">
                    <button onClick={() => removeMessage(guest.id)} className="absolute top-3 right-3 text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={16} />
                    </button>
                    <p className="text-gray-700 font-serif text-lg italic mb-4 leading-relaxed">"{guest.message}"</p>
                    <p className="font-bold text-sm uppercase tracking-widest text-right" style={{ color: theme.sage }}>- {guest.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default function WeddingApp() {
  const [view, setView] = useState('guest');
  const [guests, setGuests] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Guests
  useEffect(() => {
    const guestsRef = collection(db, 'guests');
    const unsubscribeGuests = onSnapshot(guestsRef, (snapshot) => {
      setGuests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => console.error("Error fetching guests:", error));
    return () => unsubscribeGuests();
  }, []);

  // Fetch Tables
  useEffect(() => {
    const tablesRef = collection(db, 'tables');
    const unsubscribeTables = onSnapshot(tablesRef, (snapshot) => {
      const fetchedTables = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      fetchedTables.sort((a, b) => (a.createdAt?.toMillis() || 0) - (b.createdAt?.toMillis() || 0));
      setTables(fetchedTables);
    }, (error) => console.error("Error fetching tables:", error));
    return () => unsubscribeTables();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
      <Heart className="w-8 h-8 animate-pulse" style={{ color: theme.sage }} />
    </div>
  );

  if (view === 'login') return <AdminLogin onLogin={() => setView('admin')} onCancel={() => setView('guest')} />;
  if (view === 'admin') return <AdminView guests={guests} tables={tables} setView={setView} />;
  return <GuestView setView={() => setView('login')} />;
}