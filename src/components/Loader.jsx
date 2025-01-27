// Menampilkan Loading sebelum halaman yg dituju ditampilkan

export default function Loader(){
    return(
        <div className="d-flex justify-content-center">
            <div className="row">
                <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem', position: 'absolute', left: '50%', top: '50%'}}>
                  <span className="sr-only">Tunggu Sebentar...</span>
                </div>
            </div>
        </div>
    )
}