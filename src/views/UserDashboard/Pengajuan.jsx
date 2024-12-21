import React from 'react'
import Header from '../../components/Header'



function Pengajuan() {
  return (
    <>
        <div className="container">
          <div className='mb-5'>

            <Header title="Pengajuan"/>
          </div>

          <div className='background-container'>

          <div id='success-mesaage' className="alert alert-success d-none mt-10">
            Pengajuan berhasil dikirim.
          </div>

          <div id='error-mesaage' className="alert alert-danger d-none">
            Pengajuan gagal dikirim.
          </div>

            
            <div className="form-group mb-3">
              <label for="tanggal" className="form-label">Tanggal izin</label>
              <input type="date" className="form-control" id="tanggal" name="tanggal" required />
            </div>

          <div className="form-group mb-3">
            <label for="status">Keterangan</label>
            <select className='form-control' id='keterangan' required>
            <option value="" selected disabled>Pilih Keterangan</option>
              <option value="sakit">Sakit</option>
              <option value="cuti">Cuti</option>
              <option value="izin">Izin</option>
            </select>
          </div>

            <div className="form-group mb-3">
              <label for="tanggal" className="form-label">Deskripsi</label>
              <input type="text" className="form-control" id="deskripsi" rows="3" placeholder='Deskripsi singkat'  />
            </div>

            <div class="form-group mb-2">
        <label for="gambar">Upload Bukti (Opsional)</label>
        <input type="file" className="form-control-file" id="gambar" accept="image/*" />
        <small class="form-text text-muted">Maksimal ukuran file: 10MB.</small>
    </div>

    <div id="preview-container" class="text-center"></div>

    <button id="submit-btn" class="btn btn-primary btn-block">Kirim Pengajuan</button>
    
    
        </div>
      </div>
    </>
  )
}

export default Pengajuan