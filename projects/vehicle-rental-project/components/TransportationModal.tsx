'use client'

type ModalType = 'airport' | 'city'

interface TransportationModalProps {
  type: ModalType
  onClose: () => void
}

export const TransportationModal = ({ type, onClose }: TransportationModalProps) => {
  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-0.5">Directions</p>
            <h3 className="text-lg font-semibold text-gray-900">
              {type === 'airport' ? 'From Bergen Airport' : 'From Bergen City Center'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Transport Map */}
          <div className="rounded-xl overflow-hidden border border-gray-100">
            <img
              src="/transport-map.png"
              alt="Map showing transport routes to NorthVenture"
              className="w-full h-auto"
            />
          </div>

          {type === 'airport' ? (
            <>
              {/* Bus from Airport */}
              <div className="bg-gray-50 rounded-xl border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-white border border-gray-200 text-gray-700 px-4 py-1.5 rounded-full text-sm font-semibold">Bus</span>
                  <span className="text-gray-400 text-sm">Operator: Svipper</span>
                </div>
                <div className="space-y-3 text-sm text-gray-600">
                  <p><span className="font-medium text-gray-900">Route:</span> Line 42 from Bergen Airport towards Kaldfjord / Eidkjosen</p>
                  <div>
                    <span className="font-medium text-gray-900">How to get there:</span>
                    <ol className="list-decimal list-inside mt-2 space-y-1 ml-2">
                      <li>Go to the bus stop outside the arrivals hall at Bergen Airport</li>
                      <li>Take Line 42 towards Kaldfjord / Eidkjosen</li>
                      <li>Get off at Eidkjosen (not Eidkjosvegen)</li>
                      <li>Walk to Strandgaten 123 (approx. 1 km)</li>
                    </ol>
                  </div>
                  <p><span className="font-medium text-gray-900">Price:</span> 50–80 NOK</p>
                  <p><span className="font-medium text-gray-900">Total travel time:</span> 35–45 minutes (including walk)</p>
                </div>
              </div>

              {/* Taxi from Airport */}
              <div className="bg-gray-50 rounded-xl border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-white border border-gray-200 text-gray-700 px-4 py-1.5 rounded-full text-sm font-semibold">Taxi</span>
                  <span className="text-gray-400 text-sm">Direct transport</span>
                </div>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>Take a taxi directly from the airport to Strandgaten 123.</p>
                  <div>
                    <span className="font-medium text-gray-900">Taxi companies:</span>
                    <ul className="mt-2 space-y-1 ml-2">
                      <li>Bergen Taxi AS: <a href="tel:+4703011" className="text-primary-700 hover:underline">+47 03011</a></li>
                      <li>Din Taxi: <a href="tel:+4740102045" className="text-primary-700 hover:underline">+47 401 02 045</a></li>
                    </ul>
                  </div>
                  <p><span className="font-medium text-gray-900">Price:</span> 500–700 NOK</p>
                  <p><span className="font-medium text-gray-900">Travel time:</span> 20–35 minutes</p>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Bus from City Center */}
              <div className="bg-gray-50 rounded-xl border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-white border border-gray-200 text-gray-700 px-4 py-1.5 rounded-full text-sm font-semibold">Bus</span>
                  <span className="text-gray-400 text-sm">Operator: Svipper</span>
                </div>
                <div className="space-y-3 text-sm text-gray-600">
                  <p><span className="font-medium text-gray-900">Route:</span> Line 42 from city center (e.g., Polaria/Prostneset) towards Kaldfjord / Eidkjosen</p>
                  <div>
                    <span className="font-medium text-gray-900">How to get there:</span>
                    <ol className="list-decimal list-inside mt-2 space-y-1 ml-2">
                      <li>Find a bus stop in the city center where Line 42 stops (e.g., Polaria)</li>
                      <li>Take Line 42 towards Kaldfjord / Eidkjosen</li>
                      <li>Get off at Eidkjosen (not Eidkjosvegen)</li>
                      <li>Walk to Strandgaten 123 (approx. 1 km)</li>
                    </ol>
                  </div>
                  <p><span className="font-medium text-gray-900">Price:</span> 50–80 NOK</p>
                  <p><span className="font-medium text-gray-900">Total travel time:</span> 45–60 minutes (including walk)</p>
                </div>
              </div>

              {/* Taxi from City Center */}
              <div className="bg-gray-50 rounded-xl border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-white border border-gray-200 text-gray-700 px-4 py-1.5 rounded-full text-sm font-semibold">Taxi</span>
                  <span className="text-gray-400 text-sm">Direct transport</span>
                </div>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>Take a taxi directly from Bergen city center to Strandgaten 123.</p>
                  <div>
                    <span className="font-medium text-gray-900">Taxi companies:</span>
                    <ul className="mt-2 space-y-1 ml-2">
                      <li>Bergen Taxi AS: <a href="tel:+4703011" className="text-primary-700 hover:underline">+47 03011</a></li>
                      <li>Din Taxi: <a href="tel:+4740102045" className="text-primary-700 hover:underline">+47 401 02 045</a></li>
                      <li>Maxitaxi / Andersson Taxi: <a href="tel:+4746546500" className="text-primary-700 hover:underline">+47 465 46 500</a></li>
                    </ul>
                  </div>
                  <p><span className="font-medium text-gray-900">Price:</span> 400–600 NOK</p>
                  <p><span className="font-medium text-gray-900">Travel time:</span> 20–35 minutes</p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="border-t border-gray-100 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full border-2 border-gray-900 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-900 hover:text-white transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
