    // src/components/modals/DetailAbsen.jsx
    import Swal from 'sweetalert2';
    import withReactContent from 'sweetalert2-react-content';
    import React, { useState } from 'react';
    import '../../style/css/DetailAbsen.css';

    const MySwal = withReactContent(Swal);

    const DetailAbsen = (data) => {
    let currentTab = 'foto';

    const renderContent = () => {
        if (currentTab === 'maps') {
        return `<iframe
                    src="https://maps.google.com/maps?q=${data.lat},${data.lng}&z=15&output=embed"
                    width="100%" height="250px" style="border:0;" allowfullscreen=""
                ></iframe>`;
        } else {
        return `<img src="${data.foto}" alt="Foto Absensi" class="modal-image" />`;
        }
    };

    const showModal = () => {
        MySwal.fire({
        html: `
            <div class="custom-modal">
            <div class="modal-header-custom">
                <h2>${data.nama}</h2>
                <hr class="modal-divider" />
            </div>
            <div class="modal-tabs">
                <button class="tab-btn active-tab" id="btn-foto">Foto</button>
                <button class="tab-btn" id="btn-maps">Maps</button>
            </div>
            <div id="modal-content">
                ${renderContent()}
            </div>
            </div>
        `,
        showConfirmButton: false,
        width: '700px',
        customClass: {
            popup: 'custom-modal-popup'
        },
        didOpen: () => {
            const fotoBtn = document.getElementById('btn-foto');
            const mapsBtn = document.getElementById('btn-maps');
            const contentEl = document.getElementById('modal-content');

            fotoBtn.addEventListener('click', () => {
            currentTab = 'foto';
            fotoBtn.classList.add('active-tab');
            mapsBtn.classList.remove('active-tab');
            contentEl.innerHTML = renderContent();
            });

            mapsBtn.addEventListener('click', () => {
            currentTab = 'maps';
            mapsBtn.classList.add('active-tab');
            fotoBtn.classList.remove('active-tab');
            contentEl.innerHTML = renderContent();
            });
        }
        });
    };

    showModal();
    };

    export default DetailAbsen;
