import Link from "next/link";

export default function Home() {

  return (
    <div className="bg-left-top" style={{ backgroundImage: 'url(/assets/images/humangle_foi.jpg)', backgroundSize: 'cover', minHeight: '80vh' }}>
      <div className="relative isolate px-6 pt-44 pb-16 lg:px-8 flex items-center" style={{ background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.7) 20%, rgba(255, 255, 255, 0.9) 70%, rgba(255, 255, 255, 0.5) 100%)', minHeight: '80vh' }}>
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary1 to-primary2 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>

        <div className="mx-auto max-w-6xl">
          <div className="">
            <h1 className="text-lg lg:text-xl lg:text-center font-bold tracking-tight text-gray-900 sm:text-3xl">
              HumAngle FOI Hub For Citizens
            </h1>
            <p className="mt-6 tracking-tight lg:leading-8 font-medium text-gray-700">
              The 2011 Nigeria Freedom of Information (FOI) Act aimed to promote government transparency and accountability. Delays, lack of transparency, non-compliance, and limited public awareness are frequently observed in how institutions handle it. These abuses necessitate public activism, awareness, and legal action to hold authorities accountable.
            </p>
            <p className="mt-6 tracking-tight lg:leading-8 font-medium text-gray-700">
              HumAngle has undertaken proactive measures to engage various government agencies and parastatals. These outreach efforts have received silence. This platform is dedicated to showcasing the letters sent to these government organizations and highlighting the duration of time they have remained unanswered.
            </p>
            <div className="mt-10 flex items-center lg:justify-center gap-x-6">
              <Link
                href="/foi-requests"
                className="rounded-md tracking-wider bg-primary1 px-5 py-4 text-sm font-bold text-white shadow-sm hover:bg-primary2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary4"
              >
                View Requests
              </Link>
              <Link href="/send-foi-request" className="text-sm tracking-wider font-bold leading-6 text-gray-800 hover:text-gray-950">
                Submit a request <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>

        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-primary1 to-primary2 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      </div>
    </div>
  )
}
