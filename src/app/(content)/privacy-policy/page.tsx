import { Mail } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="container flex min-h-screen max-w-320 flex-col items-center gap-5 p-4 text-lg lg:p-10">
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
        {/* Header */}
        <div className="from-main-ui-purple/90 to-main-ui-purple bg-gradient-to-r px-8 py-12 text-white">
          <h1 className="mb-4 text-4xl font-bold">Privacy Policy</h1>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none px-8 py-10">
          <div className="border-main-ui-purple mb-8 rounded-r-lg border-l-4 bg-blue-50 p-6">
            <p className="leading-relaxed text-gray-700">
              This Privacy Policy describes Our policies and procedures on the
              collection, use and disclosure of Your information when You use
              the Service and tells You about Your privacy rights and how the
              law protects You.
            </p>
          </div>

          <div className="mb-8">
            <p className="leading-relaxed text-gray-600">
              We use Your Personal data to provide and improve the Service. By
              using the Service, You agree to the collection and use of
              information in accordance with this Privacy Policy. This Privacy
              Policy has been created with the help of the{" "}
              <a
                href="https://www.privacypolicies.com/privacy-policy-generator/"
                target="_blank"
                className="text-blue-600 underline decoration-2 underline-offset-2 hover:text-blue-800"
              >
                Privacy Policy Generator
              </a>
              .
            </p>
          </div>

          <section className="mb-10">
            <h2 className="mb-6 border-b-2 border-blue-200 pb-2 text-2xl font-bold text-gray-900">
              Interpretation and Definitions
            </h2>

            <div className="mb-8">
              <h3 className="mb-4 text-xl font-semibold text-gray-800">
                Interpretation
              </h3>
              <p className="leading-relaxed text-gray-600">
                The words of which the initial letter is capitalized have
                meanings defined under the following conditions. The following
                definitions shall have the same meaning regardless of whether
                they appear in singular or in plural.
              </p>
            </div>

            <div className="mb-8">
              <h3 className="mb-4 text-xl font-semibold text-gray-800">
                Definitions
              </h3>
              <p className="mb-4 text-gray-600">
                For the purposes of this Privacy Policy:
              </p>

              <div className="rounded-lg bg-gray-50 p-6">
                <ul className="space-y-4">
                  <li className="flex flex-col gap-2">
                    <strong className="font-semibold text-gray-900">
                      Account
                    </strong>
                    <span className="text-gray-600">
                      means a unique account created for You to access our
                      Service or parts of our Service.
                    </span>
                  </li>
                  <li className="flex flex-col gap-2">
                    <strong className="font-semibold text-gray-900">
                      Affiliate
                    </strong>
                    <span className="text-gray-600">
                      means an entity that controls, is controlled by or is
                      under common control with a party, where
                      &quot;control&quot; means ownership of 50% or more of the
                      shares, equity interest or other securities entitled to
                      vote for election of directors or other managing
                      authority.
                    </span>
                  </li>
                  <li className="flex flex-col gap-2">
                    <strong className="font-semibold text-gray-900">
                      Company
                    </strong>
                    <span className="text-gray-600">
                      (referred to as either &quot;the Company&quot;,
                      &quot;We&quot;, &quot;Us&quot; or &quot;Our&quot; in this
                      Agreement) refers to Title Seeker.
                    </span>
                  </li>
                  <li className="flex flex-col gap-2">
                    <strong className="font-semibold text-gray-900">
                      Cookies
                    </strong>
                    <span className="text-gray-600">
                      are small files that are placed on Your computer, mobile
                      device or any other device by a website, containing the
                      details of Your browsing history on that website among its
                      many uses.
                    </span>
                  </li>
                  <li className="flex flex-col gap-2">
                    <strong className="font-semibold text-gray-900">
                      Country
                    </strong>
                    <span className="text-gray-600">refers to: Ukraine</span>
                  </li>
                  <li className="flex flex-col gap-2">
                    <strong className="font-semibold text-gray-900">
                      Device
                    </strong>
                    <span className="text-gray-600">
                      means any device that can access the Service such as a
                      computer, a cellphone or a digital tablet.
                    </span>
                  </li>
                  <li className="flex flex-col gap-2">
                    <strong className="font-semibold text-gray-900">
                      Personal Data
                    </strong>
                    <span className="text-gray-600">
                      is any information that relates to an identified or
                      identifiable individual.
                    </span>
                  </li>
                  <li className="flex flex-col gap-2">
                    <strong className="font-semibold text-gray-900">
                      Service
                    </strong>
                    <span className="text-gray-600">
                      refers to the Website.
                    </span>
                  </li>
                  <li className="flex flex-col gap-2">
                    <strong className="font-semibold text-gray-900">
                      Service Provider
                    </strong>
                    <span className="text-gray-600">
                      means any natural or legal person who processes the data
                      on behalf of the Company. It refers to third-party
                      companies or individuals employed by the Company to
                      facilitate the Service, to provide the Service on behalf
                      of the Company, to perform services related to the Service
                      or to assist the Company in analyzing how the Service is
                      used.
                    </span>
                  </li>
                  <li className="flex flex-col gap-2">
                    <strong className="font-semibold text-gray-900">
                      Usage Data
                    </strong>
                    <span className="text-gray-600">
                      refers to data collected automatically, either generated
                      by the use of the Service or from the Service
                      infrastructure itself (for example, the duration of a page
                      visit).
                    </span>
                  </li>
                  <li className="flex flex-col gap-2">
                    <strong className="font-semibold text-gray-900">
                      Website
                    </strong>
                    <span className="text-gray-600">
                      refers to Title Seeker, accessible from{" "}
                      <a
                        href="https://titleseeker.com"
                        rel="external nofollow noopener"
                        target="_blank"
                        className="text-blue-600 underline decoration-2 underline-offset-2 hover:text-blue-800"
                      >
                        https://titleseeker.com
                      </a>
                    </span>
                  </li>
                  <li className="flex flex-col gap-2">
                    <strong className="font-semibold text-gray-900">You</strong>
                    <span className="text-gray-600">
                      means the individual accessing or using the Service, or
                      the company, or other legal entity on behalf of which such
                      individual is accessing or using the Service, as
                      applicable.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="mb-6 border-b-2 border-blue-200 pb-2 text-2xl font-bold text-gray-900">
              Collecting and Using Your Personal Data
            </h2>

            <div className="mb-8">
              <h3 className="mb-4 text-xl font-semibold text-gray-800">
                Types of Data Collected
              </h3>

              <div className="mb-6">
                <h4 className="mb-3 text-lg font-semibold text-gray-800">
                  Personal Data
                </h4>
                <p className="mb-4 leading-relaxed text-gray-600">
                  While using Our Service, We may ask You to provide Us with
                  certain personally identifiable information that can be used
                  to contact or identify You. Personally identifiable
                  information may include, but is not limited to:
                </p>
                <div className="rounded-r-lg border-l-4 border-yellow-400 bg-yellow-50 p-4">
                  <ul className="list-inside list-disc space-y-1 text-gray-700">
                    <li>Email address</li>
                    <li>First name and last name</li>
                    <li>Usage Data</li>
                  </ul>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="mb-3 text-lg font-semibold text-gray-800">
                  Usage Data
                </h4>
                <p className="mb-4 leading-relaxed text-gray-600">
                  Usage Data is collected automatically when using the Service.
                </p>
                <div className="space-y-4 text-gray-600">
                  <p className="leading-relaxed">
                    Usage Data may include information such as Your
                    Device&apos;s Internet Protocol address (e.g. IP address),
                    browser type, browser version, the pages of our Service that
                    You visit, the time and date of Your visit, the time spent
                    on those pages, unique device identifiers and other
                    diagnostic data.
                  </p>
                  <p className="leading-relaxed">
                    When You access the Service by or through a mobile device,
                    We may collect certain information automatically, including,
                    but not limited to, the type of mobile device You use, Your
                    mobile device unique ID, the IP address of Your mobile
                    device, Your mobile operating system, the type of mobile
                    Internet browser You use, unique device identifiers and
                    other diagnostic data.
                  </p>
                  <p className="leading-relaxed">
                    We may also collect information that Your browser sends
                    whenever You visit our Service or when You access the
                    Service by or through a mobile device.
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="mb-3 text-lg font-semibold text-gray-800">
                  Tracking Technologies and Cookies
                </h4>
                <p className="mb-4 leading-relaxed text-gray-600">
                  We use Cookies and similar tracking technologies to track the
                  activity on Our Service and store certain information.
                  Tracking technologies used are beacons, tags, and scripts to
                  collect and track information and to improve and analyze Our
                  Service. The technologies We use may include:
                </p>

                <div className="mb-6 space-y-4">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h5 className="mb-2 font-semibold text-gray-800">
                      Cookies or Browser Cookies
                    </h5>
                    <p className="leading-relaxed text-gray-600">
                      A cookie is a small file placed on Your Device. You can
                      instruct Your browser to refuse all Cookies or to indicate
                      when a Cookie is being sent. However, if You do not accept
                      Cookies, You may not be able to use some parts of our
                      Service. Unless you have adjusted Your browser setting so
                      that it will refuse Cookies, our Service may use Cookies.
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4">
                    <h5 className="mb-2 font-semibold text-gray-800">
                      Web Beacons
                    </h5>
                    <p className="leading-relaxed text-gray-600">
                      Certain sections of our Service and our emails may contain
                      small electronic files known as web beacons (also referred
                      to as clear gifs, pixel tags, and single-pixel gifs) that
                      permit the Company, for example, to count users who have
                      visited those pages or opened an email and for other
                      related website statistics (for example, recording the
                      popularity of a certain section and verifying system and
                      server integrity).
                    </p>
                  </div>
                </div>

                <div className="mb-4 rounded-r-lg border-l-4 border-blue-400 bg-blue-50 p-4">
                  <p className="leading-relaxed text-gray-700">
                    Cookies can be &quot;Persistent&quot; or &quot;Session&quot;
                    Cookies. Persistent Cookies remain on Your personal computer
                    or mobile device when You go offline, while Session Cookies
                    are deleted as soon as You close Your web browser. Learn
                    more about cookies on the{" "}
                    <a
                      href="https://www.privacypolicies.com/blog/privacy-policy-template/#Use_Of_Cookies_Log_Files_And_Tracking"
                      target="_blank"
                      className="text-blue-600 underline decoration-2 underline-offset-2 hover:text-blue-800"
                    >
                      Privacy Policies website
                    </a>{" "}
                    article.
                  </p>
                </div>

                <p className="mb-4 leading-relaxed text-gray-600">
                  We use both Session and Persistent Cookies for the purposes
                  set out below:
                </p>

                <div className="space-y-6">
                  <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                    <h5 className="mb-3 text-lg font-semibold text-gray-900">
                      Necessary / Essential Cookies
                    </h5>
                    <div className="mb-3 grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div>
                        <span className="text-sm font-medium text-gray-700">
                          Type:
                        </span>
                        <span className="ml-1 text-sm text-gray-600">
                          Session Cookies
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">
                          Administered by:
                        </span>
                        <span className="ml-1 text-sm text-gray-600">Us</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Purpose:
                      </span>
                      <p className="mt-1 text-sm leading-relaxed text-gray-600">
                        These Cookies are essential to provide You with services
                        available through the Website and to enable You to use
                        some of its features. They help to authenticate users
                        and prevent fraudulent use of user accounts. Without
                        these Cookies, the services that You have asked for
                        cannot be provided, and We only use these Cookies to
                        provide You with those services.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                    <h5 className="mb-3 text-lg font-semibold text-gray-900">
                      Cookies Policy / Notice Acceptance Cookies
                    </h5>
                    <div className="mb-3 grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div>
                        <span className="text-sm font-medium text-gray-700">
                          Type:
                        </span>
                        <span className="ml-1 text-sm text-gray-600">
                          Persistent Cookies
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">
                          Administered by:
                        </span>
                        <span className="ml-1 text-sm text-gray-600">Us</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Purpose:
                      </span>
                      <p className="mt-1 text-sm leading-relaxed text-gray-600">
                        These Cookies identify if users have accepted the use of
                        cookies on the Website.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                    <h5 className="mb-3 text-lg font-semibold text-gray-900">
                      Functionality Cookies
                    </h5>
                    <div className="mb-3 grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div>
                        <span className="text-sm font-medium text-gray-700">
                          Type:
                        </span>
                        <span className="ml-1 text-sm text-gray-600">
                          Persistent Cookies
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">
                          Administered by:
                        </span>
                        <span className="ml-1 text-sm text-gray-600">Us</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Purpose:
                      </span>
                      <p className="mt-1 text-sm leading-relaxed text-gray-600">
                        These Cookies allow us to remember choices You make when
                        You use the Website, such as remembering your login
                        details or language preference. The purpose of these
                        Cookies is to provide You with a more personal
                        experience and to avoid You having to re-enter your
                        preferences every time You use the Website.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-r-lg border-l-4 border-yellow-400 bg-yellow-50 p-4">
                  <p className="leading-relaxed text-gray-700">
                    For more information about the cookies we use and your
                    choices regarding cookies, please visit our Cookies Policy
                    or the Cookies section of our Privacy Policy.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Use of Your Personal Data Section */}
          <section className="mt-12">
            <div className="mb-6 border-b-2 border-gray-200 pb-3">
              <h2 className="text-3xl font-bold text-gray-900">
                Use of Your Personal Data
              </h2>
            </div>

            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-gray-700">
                The Company may use Personal Data for the following purposes:
              </p>

              <div className="space-y-6">
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-3 text-xl font-semibold text-gray-900">
                    Service Provision and Management
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500"></span>
                      <span>
                        <strong>To provide and maintain our Service</strong>,
                        including to monitor the usage of our Service.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500"></span>
                      <span>
                        <strong>To manage Your Account</strong>: to manage Your
                        registration as a user of the Service. The Personal Data
                        You provide can give You access to different
                        functionalities of the Service that are available to You
                        as a registered user.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500"></span>
                      <span>
                        <strong>For the performance of a contract</strong>: the
                        development, compliance and undertaking of the purchase
                        contract for the products, items or services You have
                        purchased or of any other contract with Us through the
                        Service.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-3 text-xl font-semibold text-gray-900">
                    Communication and Support
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500"></span>
                      <span>
                        <strong>To contact You</strong>: To contact You by
                        email, telephone calls, SMS, or other equivalent forms
                        of electronic communication, such as a mobile
                        application&apos;s push notifications regarding updates
                        or informative communications related to the
                        functionalities, products or contracted services,
                        including the security updates, when necessary or
                        reasonable for their implementation.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500"></span>
                      <span>
                        <strong>To provide You</strong> with news, special
                        offers and general information about other goods,
                        services and events which we offer that are similar to
                        those that you have already purchased or enquired about
                        unless You have opted not to receive such information.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-3 text-xl font-semibold text-gray-900">
                    Business Operations
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-500"></span>
                      <span>
                        <strong>To manage Your requests</strong>: To attend and
                        manage Your requests to Us.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-500"></span>
                      <span>
                        <strong>For business transfers</strong>: We may use Your
                        information to evaluate or conduct a merger,
                        divestiture, restructuring, reorganization, dissolution,
                        or other sale or transfer of some or all of Our assets,
                        whether as a going concern or as part of bankruptcy,
                        liquidation, or similar proceeding, in which Personal
                        Data held by Us about our Service users is among the
                        assets transferred.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-500"></span>
                      <span>
                        <strong>For other purposes</strong>: We may use Your
                        information for other purposes, such as data analysis,
                        identifying usage trends, determining the effectiveness
                        of our promotional campaigns and to evaluate and improve
                        our Service, products, services, marketing and your
                        experience.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-r-lg border-l-4 border-orange-400 bg-orange-50 p-4">
                  <h3 className="mb-3 text-lg font-semibold text-gray-900">
                    Information Sharing Scenarios
                  </h3>
                  <p className="mb-4 text-gray-700">
                    We may share Your personal information in the following
                    situations:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-orange-500"></span>
                      <span>
                        <strong>With Service Providers</strong>: We may share
                        Your personal information with Service Providers to
                        monitor and analyze the use of our Service, to contact
                        You.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-orange-500"></span>
                      <span>
                        <strong>For business transfers</strong>: We may share or
                        transfer Your personal information in connection with,
                        or during negotiations of, any merger, sale of Company
                        assets, financing, or acquisition of all or a portion of
                        Our business to another company.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-orange-500"></span>
                      <span>
                        <strong>With Affiliates</strong>: We may share Your
                        information with Our affiliates, in which case we will
                        require those affiliates to honor this Privacy Policy.
                        Affiliates include Our parent company and any other
                        subsidiaries, joint venture partners or other companies
                        that We control or that are under common control with
                        Us.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-orange-500"></span>
                      <span>
                        <strong>With business partners</strong>: We may share
                        Your information with Our business partners to offer You
                        certain products, services or promotions.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-orange-500"></span>
                      <span>
                        <strong>With other users</strong>: when You share
                        personal information or otherwise interact in the public
                        areas with other users, such information may be viewed
                        by all users and may be publicly distributed outside.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-orange-500"></span>
                      <span>
                        <strong>With Your consent</strong>: We may disclose Your
                        personal information for any other purpose with Your
                        consent.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-r-lg border-l-4 border-red-400 bg-red-50 p-4">
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    Important Notice
                  </h3>
                  <p className="text-gray-700">
                    We will never sell, rent, or lease Your personal information
                    to third parties for their marketing purposes without Your
                    explicit consent. Any sharing of information is done in
                    accordance with this Privacy Policy and applicable data
                    protection laws.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Retention of Your Personal Data Section */}
          <section className="mt-12">
            <div className="mb-6 border-b-2 border-gray-200 pb-3">
              <h2 className="text-3xl font-bold text-gray-900">
                Retention of Your Personal Data
              </h2>
            </div>

            <div className="space-y-6">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-xl font-semibold text-gray-900">
                  General Retention Policy
                </h3>
                <p className="leading-relaxed text-gray-700">
                  The Company will retain Your Personal Data only for as long as
                  is necessary for the purposes set out in this Privacy Policy.
                  We will retain and use Your Personal Data to the extent
                  necessary to comply with our legal obligations (for example,
                  if we are required to retain your data to comply with
                  applicable laws), resolve disputes, and enforce our legal
                  agreements and policies.
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-xl font-semibold text-gray-900">
                  Usage Data Retention
                </h3>
                <p className="leading-relaxed text-gray-700">
                  The Company will also retain Usage Data for internal analysis
                  purposes. Usage Data is generally retained for a shorter
                  period of time, except when this data is used to strengthen
                  the security or to improve the functionality of Our Service,
                  or We are legally obligated to retain this data for longer
                  time periods.
                </p>
              </div>

              <div className="rounded-r-lg border-l-4 border-blue-400 bg-blue-50 p-4">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Retention Timeline
                </h3>
                <p className="text-gray-700">
                  We review our data retention practices regularly to ensure we
                  only keep your information for as long as necessary and in
                  accordance with applicable laws and regulations.
                </p>
              </div>
            </div>
          </section>

          {/* Transfer of Your Personal Data Section */}
          <section className="mt-12">
            <div className="mb-6 border-b-2 border-gray-200 pb-3">
              <h2 className="text-3xl font-bold text-gray-900">
                Transfer of Your Personal Data
              </h2>
            </div>

            <div className="space-y-6">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-xl font-semibold text-gray-900">
                  Processing Locations
                </h3>
                <p className="leading-relaxed text-gray-700">
                  Your information, including Personal Data, is processed at the
                  Company&apos;s operating offices and in any other places where
                  the parties involved in the processing are located. It means
                  that this information may be transferred to — and maintained
                  on — computers located outside of Your state, province,
                  country or other governmental jurisdiction where the data
                  protection laws may differ than those from Your jurisdiction.
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-xl font-semibold text-gray-900">
                  Your Consent
                </h3>
                <p className="leading-relaxed text-gray-700">
                  Your consent to this Privacy Policy followed by Your
                  submission of such information represents Your agreement to
                  that transfer.
                </p>
              </div>

              <div className="rounded-r-lg border-l-4 border-green-400 bg-green-50 p-4">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Security Commitment
                </h3>
                <p className="text-gray-700">
                  The Company will take all steps reasonably necessary to ensure
                  that Your data is treated securely and in accordance with this
                  Privacy Policy and no transfer of Your Personal Data will take
                  place to an organization or a country unless there are
                  adequate controls in place including the security of Your data
                  and other personal information.
                </p>
              </div>
            </div>
          </section>

          {/* Delete Your Personal Data Section */}
          <section className="mt-12">
            <div className="mb-6 border-b-2 border-gray-200 pb-3">
              <h2 className="text-3xl font-bold text-gray-900">
                Delete Your Personal Data
              </h2>
            </div>

            <div className="space-y-6">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-xl font-semibold text-gray-900">
                  Your Deletion Rights
                </h3>
                <p className="leading-relaxed text-gray-700">
                  You have the right to delete or request that We assist in
                  deleting the Personal Data that We have collected about You.
                </p>
              </div>

              <div className="space-y-4">
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-xl font-semibold text-gray-900">
                    Self-Service Options
                  </h3>
                  <p className="mb-4 leading-relaxed text-gray-700">
                    Our Service may give You the ability to delete certain
                    information about You from within the Service.
                  </p>
                  <p className="leading-relaxed text-gray-700">
                    You may update, amend, or delete Your information at any
                    time by signing in to Your Account, if you have one, and
                    visiting the account settings section that allows you to
                    manage Your personal information. You may also contact Us to
                    request access to, correct, or delete any personal
                    information that You have provided to Us.
                  </p>
                </div>

                <div className="rounded-r-lg border-l-4 border-yellow-400 bg-yellow-50 p-4">
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    Legal Obligations
                  </h3>
                  <p className="text-gray-700">
                    Please note, however, that We may need to retain certain
                    information when we have a legal obligation or lawful basis
                    to do so.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Disclosure of Your Personal Data Section */}
          <section className="mt-12">
            <div className="mb-6 border-b-2 border-gray-200 pb-3">
              <h2 className="text-3xl font-bold text-gray-900">
                Disclosure of Your Personal Data
              </h2>
            </div>

            <div className="space-y-6">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-xl font-semibold text-gray-900">
                  Business Transactions
                </h3>
                <p className="leading-relaxed text-gray-700">
                  If the Company is involved in a merger, acquisition or asset
                  sale, Your Personal Data may be transferred. We will provide
                  notice before Your Personal Data is transferred and becomes
                  subject to a different Privacy Policy.
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-xl font-semibold text-gray-900">
                  Law Enforcement
                </h3>
                <p className="leading-relaxed text-gray-700">
                  Under certain circumstances, the Company may be required to
                  disclose Your Personal Data if required to do so by law or in
                  response to valid requests by public authorities (e.g. a court
                  or a government agency).
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-xl font-semibold text-gray-900">
                  Other Legal Requirements
                </h3>
                <p className="mb-4 leading-relaxed text-gray-700">
                  The Company may disclose Your Personal Data in the good faith
                  belief that such action is necessary to:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-500"></span>
                    <span>Comply with a legal obligation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-500"></span>
                    <span>
                      Protect and defend the rights or property of the Company
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-500"></span>
                    <span>
                      Prevent or investigate possible wrongdoing in connection
                      with the Service
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-500"></span>
                    <span>
                      Protect the personal safety of Users of the Service or the
                      public
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-500"></span>
                    <span>Protect against legal liability</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-r-lg border-l-4 border-red-400 bg-red-50 p-4">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Important Disclosure Notice
                </h3>
                <p className="text-gray-700">
                  Any disclosure of Your Personal Data will only occur when
                  legally required or necessary to protect our users, service,
                  or legal rights. We are committed to transparency and will
                  notify you whenever possible and legally permissible.
                </p>
              </div>
            </div>
          </section>

          {/* Security of Your Personal Data Section */}
          <section className="mt-12">
            <div className="mb-6 border-b-2 border-gray-200 pb-3">
              <h2 className="text-3xl font-bold text-gray-900">
                Security of Your Personal Data
              </h2>
            </div>

            <div className="space-y-6">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-xl font-semibold text-gray-900">
                  Our Security Commitment
                </h3>
                <p className="leading-relaxed text-gray-700">
                  The security of Your Personal Data is important to Us, but
                  remember that no method of transmission over the Internet, or
                  method of electronic storage is 100% secure. While We strive
                  to use commercially acceptable means to protect Your Personal
                  Data, We cannot guarantee its absolute security.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <h4 className="mb-2 font-semibold text-green-900">
                    What We Do
                  </h4>
                  <ul className="space-y-1 text-sm text-green-800">
                    <li>• Use industry-standard encryption</li>
                    <li>• Regular security audits</li>
                    <li>• Secure data transmission</li>
                    <li>• Access controls and authentication</li>
                  </ul>
                </div>

                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <h4 className="mb-2 font-semibold text-blue-900">
                    What You Can Do
                  </h4>
                  <ul className="space-y-1 text-sm text-blue-800">
                    <li>• Use strong, unique passwords</li>
                    <li>• Keep your account information private</li>
                    <li>• Log out from shared devices</li>
                    <li>• Report suspicious activity</li>
                  </ul>
                </div>
              </div>

              <div className="rounded-r-lg border-l-4 border-yellow-400 bg-yellow-50 p-4">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Security Transparency
                </h3>
                <p className="text-gray-700">
                  We continuously monitor and improve our security practices. In
                  the unlikely event of a data breach, we will notify affected
                  users and relevant authorities as required by applicable laws
                  and regulations.
                </p>
              </div>
            </div>
          </section>

          {/* Children's Privacy Section */}
          <section className="mt-12">
            <div className="mb-6 border-b-2 border-gray-200 pb-3">
              <h2 className="text-3xl font-bold text-gray-900">
                Children&apos;s Privacy
              </h2>
            </div>

            <div className="space-y-6">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-xl font-semibold text-gray-900">
                  Age Restrictions
                </h3>
                <p className="leading-relaxed text-gray-700">
                  Our Service does not address anyone under the age of 13. We do
                  not knowingly collect personally identifiable information from
                  anyone under the age of 13. If You are a parent or guardian
                  and You are aware that Your child has provided Us with
                  Personal Data, please contact Us. If We become aware that We
                  have collected Personal Data from anyone under the age of 13
                  without verification of parental consent, We take steps to
                  remove that information from Our servers.
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-xl font-semibold text-gray-900">
                  Parental Consent Requirements
                </h3>
                <p className="leading-relaxed text-gray-700">
                  If We need to rely on consent as a legal basis for processing
                  Your information and Your country requires consent from a
                  parent, We may require Your parent&apos;s consent before We
                  collect and use that information.
                </p>
              </div>

              <div className="rounded-r-lg border-l-4 border-purple-400 bg-purple-50 p-4">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Protecting Children Online
                </h3>
                <p className="text-gray-700">
                  We are committed to protecting children&apos;s privacy online.
                  Parents and guardians are encouraged to monitor their
                  children&apos;s internet usage and to help enforce our Privacy
                  Policy by instructing their children never to provide personal
                  information through our Service without permission.
                </p>
              </div>
            </div>
          </section>

          {/* Links to Other Websites Section */}
          <section className="mt-12">
            <div className="mb-6 border-b-2 border-gray-200 pb-3">
              <h2 className="text-3xl font-bold text-gray-900">
                Links to Other Websites
              </h2>
            </div>

            <div className="space-y-6">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-xl font-semibold text-gray-900">
                  Third-Party Links
                </h3>
                <p className="leading-relaxed text-gray-700">
                  Our Service may contain links to other websites that are not
                  operated by Us. If You click on a third party link, You will
                  be directed to that third party&apos;s site. We strongly
                  advise You to review the Privacy Policy of every site You
                  visit.
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-xl font-semibold text-gray-900">
                  No Responsibility for Third Parties
                </h3>
                <p className="leading-relaxed text-gray-700">
                  We have no control over and assume no responsibility for the
                  content, privacy policies or practices of any third party
                  sites or services.
                </p>
              </div>

              <div className="rounded-r-lg border-l-4 border-amber-400 bg-amber-50 p-4">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Important Reminder
                </h3>
                <p className="text-gray-700">
                  When you leave our website through external links, you are
                  subject to the privacy policies and terms of those external
                  websites. Always read and understand the privacy policies of
                  websites you visit to protect your personal information.
                </p>
              </div>
            </div>
          </section>

          {/* Changes to this Privacy Policy Section */}
          <section className="mt-12">
            <div className="mb-6 border-b-2 border-gray-200 pb-3">
              <h2 className="text-3xl font-bold text-gray-900">
                Changes to this Privacy Policy
              </h2>
            </div>

            <div className="space-y-6">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-xl font-semibold text-gray-900">
                  Policy Updates
                </h3>
                <p className="leading-relaxed text-gray-700">
                  We may update Our Privacy Policy from time to time. We will
                  notify You of any changes by posting the new Privacy Policy on
                  this page.
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-xl font-semibold text-gray-900">
                  Notification Process
                </h3>
                <p className="leading-relaxed text-gray-700">
                  We will let You know via email and/or a prominent notice on
                  Our Service, prior to the change becoming effective and update
                  the &quot;Last updated&quot; date at the top of this Privacy
                  Policy.
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-xl font-semibold text-gray-900">
                  Your Responsibility
                </h3>
                <p className="leading-relaxed text-gray-700">
                  You are advised to review this Privacy Policy periodically for
                  any changes. Changes to this Privacy Policy are effective when
                  they are posted on this page.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="mt-12 rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Contact Us
            </h2>
            <p className="mb-4 text-gray-600">
              If you have any questions about this Privacy Policy, You can
              contact us:
            </p>
            <div className="flex items-center gap-2 text-blue-600">
              <a
                href="mailto:yablunovsky.a@gmail.com"
                className="flex items-center gap-1 font-semibold underline decoration-2 underline-offset-2 hover:text-blue-800"
              >
                <Mail size={18} />
                <span>yablunovsky.a@gmail.com</span>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
