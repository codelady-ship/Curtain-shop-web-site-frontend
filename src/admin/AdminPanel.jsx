
import { useState } from 'react';

export default function AdminPanel(){

  const [step, setStep] = useState(1);

  return (
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>

      {/* LEFT */}
      <div>
        <h2>Admin Məlumatları</h2>
        <input placeholder="Ad" />
        <input placeholder="Email" />
        <input placeholder="Telefon" />
        <button>Məlumatları saxla</button>
      </div>

      {/* RIGHT */}
      <div>
        <h2>Şifrə Bərpası</h2>

        {step === 1 && (
          <>
            <input placeholder="Email / Telefon / Username" />
            <button onClick={()=>setStep(2)}>Kod göndər</button>
          </>
        )}

        {step === 2 && (
          <>
            <input placeholder="Kod" />
            <button onClick={()=>setStep(3)}>Təsdiqlə</button>
          </>
        )}

        {step === 3 && (
          <>
            <input placeholder="Yeni şifrə" />
            <button>Yenilə</button>
          </>
        )}
      </div>

    </div>
  );
}
