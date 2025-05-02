{animal.estado !== "Disponible" && (
    <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Este compañero ya tiene proceso de adopción en curso</h3>
      
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        {/* Plan 1: Lista de espera */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-emerald-100">
          <div className="bg-emerald-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 className="font-medium text-lg mb-2">Lista de espera</h4>
          <p className="text-gray-600 mb-3">Si la adopción no se concreta, te contactaremos para que seas el primero en conocerlo.</p>
          <button 
            onClick={() => navigate('/registro', { state: { listaEspera: animal.id } })}
            className="text-emerald-600 hover:text-emerald-800 font-medium text-sm flex items-center"
          >
            Unirme a la lista
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
  
        {/* Plan 2: Animales similares */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-blue-100">
          <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </div>
          <h4 className="font-medium text-lg mb-2">Conoce similares</h4>
          <p className="text-gray-600 mb-3">Tenemos otros compañeros con características similares esperando un hogar.</p>
          <button 
            onClick={() => navigate('/animales', { state: { filtro: animal.especie } })}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
          >
            Ver {animal.especie === 'Perro' ? 'perritos' : animal.especie === 'Gato' ? 'gatitos' : 'animales'}
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
  
        {/* Plan 3: Apadrinamiento */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-purple-100">
          <div className="bg-purple-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <h4 className="font-medium text-lg mb-2">Apadrina</h4>
          <p className="text-gray-600 mb-3">Colabora con su manutención mientras espera su hogar definitivo.</p>
          <button 
            onClick={() => navigate('/apadrina', { state: { animalId: animal.id } })}
            className="text-purple-600 hover:text-purple-800 font-medium text-sm flex items-center"
          >
            Conoce cómo ayudar
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
  
      <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
        <h4 className="font-medium text-emerald-800 mb-2">¿Por qué algunos animales no están disponibles?</h4>
        <p className="text-sm text-emerald-700">
          Cuando un animal está en proceso de adopción, damos tiempo para que adoptante y animal se conozcan.
          Si no hay compatibilidad, volverá a estar disponible. ¡No te desanimes!
        </p>
      </div>
    </div>
  )}