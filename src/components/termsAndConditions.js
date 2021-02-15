import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import styles from '../modules/screens/auth/styles';
import { Container, Header, Content, Row, Col, H2, H3, Button, Card, Left, Right, Body, Icon, Title } from 'native-base';
import { CURRENT_APP_NAME } from '../setup/config'

import {primaryColor} from '../setup/config'

class TermsAndConditions extends Component {
  constructor() {
    super();
    this.state = {
    }
  }
  render() {
    return (
      <Container style={styles.container}>
        <Header style={{ backgroundColor: primaryColor }}>
          <Row >
            <Col style={{ marginLeft: 10, marginTop: 10, width: '25%' }}>
              <Image source={require('../../assets/images/Logo.png')} style={{ height: 40, width: 40 }} />
            </Col>
            <Col style={{ justifyContent: 'center', width: '75%' }} >
              <Text style={{ fontSize: 20, color: '#fff', }}>Terms and Conditions</Text>
            </Col>
          </Row>
        </Header>
        <Content>

          <View style={{ padding: 20, marginTop: 10 }}>

            <H3 style={{ fontSize: 15 }}>{`We hope you love using ${CURRENT_APP_NAME}. We really do. This document contains important information that you need to consider before making an important decision.`}</H3>

            <H3 style={{ color: 'gray', fontSize: 16, marginTop: 10 }}>Effective Date: May 14, 2019</H3>

            <Text style={termsStyles.normalText}>{`The following terms and conditions constitute an agreement between you and ${CURRENT_APP_NAME}, Inc. (${CURRENT_APP_NAME},” “we,” or “us”), the operator of ${CURRENT_APP_NAME}.com (the “Site”) and related websites, applications, services and mobile applications provided by ${CURRENT_APP_NAME} and on/in which these Terms of Use are posted or referenced (collectively, the “Services”). These terms of use (the “Terms of Use”), together with our `}

              <H3 style={termsStyles.urlStyle}> PRIVACY POLICY, ACCEPTABLE USE POLICY </H3> and  <H3 style={termsStyles.urlStyle}>ADDITIONAL TERMS </H3>{` (each of which are incorporated herein by reference, and collectively, this “Agreement”) govern your use of the Services, whether or not you have created an account. You must agree to and accept all of the terms of this Agreement, or you don’t have the right to use the Services.`}
            </Text>

            <H3 style={termsStyles.capsText}>" BY USING OR OTHERWISE ACCESSING THE SERVICES AND/OR BY CREATING AN ACCOUNT WITH US, YOU AGREE TO THE TERMS OF THIS AGREEMENT, INCLUDING THE INFORMATION PRACTICES DISCLOSED IN OUR PRIVACY POLICY, THE USE RESTRICTIONS IN THE ACCEPTABLE USE POLICY AND THE TERMS AND CONDITIONS IN THE ADDITIONAL TERMS. IF YOU DO NOT AGREE WITH THIS AGREEMENT, YOU CANNOT USE THE SERVICES. ARBITRATION NOTICE AND CLASS ACTION WAIVER: YOU AGREE THAT DISPUTES BETWEEN YOU AND US WILL BE RESOLVED BY BINDING, INDIVIDUAL ARBITRATION AND THAT YOU WAIVE YOUR RIGHT TO PARTICIPATE IN A CLASS OR COLLECTIVE ACTION LAWSUIT, OR CLASS OR COLLECTIVE ARBITRATION. "
</H3>

            <Text style={termsStyles.normalText}>If you create an account or use the Services on behalf of an individual or entity other than yourself, you represent that you are authorized by such individual or entity to accept this Agreement on such individual’s or entity’s behalf.
</Text>

            <H3 style={termsStyles.mainHeading}>1. ABOUT THE SITE</H3>
            <Text style={termsStyles.normalText}>
              {` Portions of the Services can be viewed without a ${CURRENT_APP_NAME} account. To benefit from all of the Services we offer, you must create a ${CURRENT_APP_NAME} account and provide certain basic information about yourself, which you authorize ${CURRENT_APP_NAME} to use and disclose as described in our Privacy Policy. You acknowledge that although some Content may be provided by healthcare professionals, the provision of such Content does not create a medical professional/patient relationship, and does not constitute an opinion, medical advice, or diagnosis or treatment, but is provided to assist you in choosing a doctor, dentist or other healthcare specialist, professional, provider, organization, or agents or affiliates thereof (collectively, “Healthcare Provider”). “Content” means content, text, data, graphics, images, photographs, video, audio, information, suggestions, guidance, and other materials provided, made available or otherwise found through the Services and/or Site, including, without limitation, Content provided in direct response to your questions or postings.`}
            </Text>

            <H3 style={termsStyles.capsText}>" WHILE WE MAKE REASONABLE EFFORTS TO PROVIDE YOU WITH ACCURATE CONTENT, WE MAKE NO GUARANTEES, REPRESENTATIONS OR WARRANTIES, WHETHER EXPRESSED OR IMPLIED, WITH RESPECT TO PROFESSIONAL QUALIFICATIONS, EXPERTISE, QUALITY OF WORK, PRICE OR COST INFORMATION, INSURANCE COVERAGE OR BENEFIT INFORMATION, OR ANY OTHER CONTENT AVAILABLE THROUGH THE SERVICES. IN NO EVENT SHALL WE BE LIABLE TO YOU OR ANYONE ELSE FOR ANY DECISION MADE OR ACTION TAKEN BY YOU IN RELIANCE ON ANY SUCH CONTENT.FURTHERMORE, WE DO NOT IN ANY WAY ENDORSE OR RECOMMEND ANY INDIVIDUAL OR ENTITY LISTED OR ACCESSIBLE THROUGH THE SERVICES. "
</H3>

            <H3 style={termsStyles.mainHeading}>2. WE DO NOT PROVIDE MEDICAL ADVICE</H3>
            <Text style={termsStyles.normalText}>{`
The Content that you obtain or receive from ${CURRENT_APP_NAME}, its employees, contractors, partners, sponsors, advertisers, licensors or otherwise through the Services, is for informational, scheduling and payment purposes only. All medically related information, including, without limitation, information shared via ${CURRENT_APP_NAME} Answers, the ${CURRENT_APP_NAME} blog, ${CURRENT_APP_NAME} social channels, ${CURRENT_APP_NAME} emails and text messages, and ${CURRENT_APP_NAME} advertising, comes from independent healthcare professionals and organizations and is for informational purposes only.`}
            </Text>
            <H3 style={termsStyles.capsText}>
              " WHILE WE HOPE THE CONTENT IS USEFUL IN YOUR HEALTHCARE JOURNEY, IT IS NOT INTENDED AS A SUBSTITUTE FOR, NOR DOES IT REPLACE, PROFESSIONAL MEDICAL ADVICE, DIAGNOSIS, OR TREATMENT. DO NOT DISREGARD, AVOID OR DELAY OBTAINING MEDICAL ADVICE FROM A QUALIFIED HEALTHCARE PROVIDER, UNDER ANY CIRCUMSTANCE. DO NOT USE THE SERVICES FOR EMERGENCY MEDICAL NEEDS. IF YOU EXPERIENCE A MEDICAL EMERGENCY, IMMEDIATELY CALL A HEALTHCARE PROFESSIONAL AND 101. YOUR USE OF THE CONTENT IS SOLELY AT YOUR OWN RISK.NOTHING STATED OR POSTED ON THE SITE OR AVAILABLE THROUGH ANY SERVICES IS INTENDED TO BE, AND MUST NOT BE TAKEN TO BE, THE PRACTICE OF MEDICINE, DENTISTRY, NURSING, OR OTHER PROFESSIONAL HEALTHCARE ADVICE, OR THE PROVISION OF MEDICAL CARE."
</H3>
            <Text style={termsStyles.normalText}>
              We do not recommend or endorse any specific tests, Healthcare Providers, procedures, opinions, or other information that may appear through the Services. If you rely on any Content, you do so solely at your own risk. We encourage you to independently confirm any Content relevant to you with other sources, including the Healthcare Provider’s office, medical associations relevant to the applicable specialty, your state medical boards, and the appropriate licensing or certification authorities to verify listed credentials and education.
          </Text>

            <H3 style={termsStyles.mainHeading}>3. NO DOCTOR PATIENT RELATIONSHIP</H3>
            <H3 style={termsStyles.capsText}>
              {`  " DOCTORS, DENTISTS, NURSES, PHYSICAL THERAPIST AND OTHER MEDICAL PROFESSIONALS USE THE SERVICES TO SHARE CONTENT WITH YOU, BUT YOUR USE OF THIS CONTENT IS NOT A SUBSTITUTE FOR HEALTHCARE. NO LICENSED MEDICAL PROFESSIONAL/PATIENT RELATIONSHIP IS CREATED WHEN YOU USE THE SERVICES OR CONTENT. THIS IS TRUE WHETHER SUCH CONTENT IS PROVIDED BY OR THROUGH THE USE OF THE SERVICES OR THROUGH ANY OTHER COMMUNICATIONS FROM ${CURRENT_APP_NAME} INCLUDING, WITHOUT LIMITATION, THE “FIND A DOCTOR” FEATURE, ${CURRENT_APP_NAME} ANSWERS, ${CURRENT_APP_NAME} BLOG, ${CURRENT_APP_NAME} SOCIAL CHANNELS, ${CURRENT_APP_NAME} EMAILS OR TEXT MESSAGE LINKS TO OTHER SITES, OR ANY ASSISTANCE WE MAY PROVIDE TO HELP YOU FIND AN APPROPRIATE HEALTHCARE PROVIDER IN ANY FIELD. "`}
            </H3>
            <Text style={termsStyles.normalText}>{`
              ${CURRENT_APP_NAME} encourages Healthcare Providers to use the Services responsibly, but we have no control over, and cannot guarantee the availability of, any Healthcare Provider at any particular time. We will not be liable for cancelled or otherwise unfulfilled appointments, or any injury or loss resulting therefrom, or for any other injury or loss resulting or arising from, or related to, the use of the Site or Services whatsoever.`}
            </Text>

            <H3 style={termsStyles.mainHeading}>4. AUTHORIZATION AND ACKNOWLEDGEMENT; IMPORTANT INFORMATION ABOUT HEALTHCARE PROVIDER RELATIONSHIPS AND HEALTHCARE PROVIDER LISTS
</H3>
            <Text style={termsStyles.normalText}>
              In connection with using the Site and the Services to locate and schedule appointments with Healthcare Providers, you understand that:
          </Text>
            <H3 style={termsStyles.capsText}>
              " YOU ARE RESPONSIBLE FOR CHOOSING YOUR OWN HEALTHCARE PROVIDER, INCLUDING WITHOUT LIMITATION, DETERMINING WHETHER THE APPLICABLE HEALTHCARE PROVIDER IS SUITABLE FOR YOUR HEALTHCARE NEEDS BASED ON SPECIALTY, EXPERIENCE, QUALIFICATION, LICENSES AND OTHER IMPORTANT FACTS AND CIRCUMSTANCES THAT COULD IMPACT YOUR CARE. "
</H3>
            <Text style={termsStyles.normalText}>{`
              ${CURRENT_APP_NAME} or its designee takes certain limited steps to (a) verify that Healthcare Providers participating in the Services hold certain active licenses, certifications or registrations required by law to practice the specialties of the services offered by them through the Services, and (b) verify that Healthcare Providers are not listed in the Indian Department of Health and Human Services Office of the Inspector General Exclusion database.${CURRENT_APP_NAME} may also exclude Healthcare Providers from our Services who, in ${CURRENT_APP_NAME}’s discretion, have engaged in inappropriate or unprofessional conduct.`}
            </Text>
            <Text style={termsStyles.normalText}>{`
              Some Healthcare Providers listed through the Services enter into contracts with us, and may pay us a fee in order to be marketed through or to use the Services. To help you find Healthcare Providers who may be suitable for your needs, and enable the maximum choice and diversity of Healthcare Providers participating in the Services, we will provide you with lists and/or profiles of Healthcare Providers. These results are based on information that you provide to us, such as insurance information, geographical location, and healthcare specialty. They may also be based on other criteria (including, for example, Healthcare Provider availability, past selections by and/or ratings of Healthcare Providers by you or by other ${CURRENT_APP_NAME} users, and past experience of ${CURRENT_APP_NAME} users with Healthcare Providers). Note that ${CURRENT_APP_NAME} (a) does not recommend or endorse any Healthcare Providers, (b) does not make any representations or warranties with respect to these Healthcare Providers or the quality of the healthcare services they may provide, and (c) does not receive any additional fees from Healthcare Providers for featuring them (i.e., higher or better placement on lists) through the Services (subject to Sponsored Results as described below). Note, however, to the extent that you use the Services as provided by your employer, ${CURRENT_APP_NAME} may provide lists and/or profile previews based also on criteria determined by your employer and your employer’s agents or advisors. In addition, to the extent that ${CURRENT_APP_NAME} serves as a platform for, or provides technical support to, the provider directory associated with your health coverage, Healthcare Providers will appear in the directory based on criteria determined by your health plan or plan sponsor, as applicable. We may show you advertisements or sponsored results (“Sponsored Results”)on the Site, including above the search results. ${CURRENT_APP_NAME} receives additional fees from Healthcare Providers for providing Sponsored Results. Sponsored Results shown through the Services are not, and should not be considered, an endorsement or recommendation by ${CURRENT_APP_NAME} of the Healthcare Provider.`}
            </Text>

            <H3 style={termsStyles.mainHeading}>5. THE SERVICES AND CONTENT ARE INFORMATIONAL AND EDUCATIONAL RESOURCES
</H3>
            <Text style={termsStyles.normalText}>{`
              The Services are an informational and educational resource for consumers and Healthcare Providers. We may, but have no obligation to, publish Content through the Services that is reviewed by our editorial personnel. No party (including  ${CURRENT_APP_NAME}) involved in the preparation or publication of such works guarantee that the Content is timely, accurate or complete, and they will not be responsible or liable for any errors or omissions in, or for the results obtained from the use of, such Content.`}
            </Text>
            <Text style={termsStyles.normalText}>
              Healthcare Provider Content:
</Text>
            <Text style={termsStyles.normalText}>{`
              Healthcare Provider and practice Content is intended for general reference purposes only. Healthcare Provider Content may be provided by the Healthcare Provider and/or office staff and collected from multiple other data sources that may not be confirmed by the Healthcare Provider. Such Content can change frequently and may become out of date, incomplete or inaccurate. Neither the Site nor  ${CURRENT_APP_NAME} provides any advice or qualification certification about any particular Healthcare Provider. `}
            </Text>
            <Text style={termsStyles.normalText}>
              Procedures/Products/Services:
</Text>
            <Text style={termsStyles.normalText}>
              Procedures, products, services and devices discussed and/or marketed through the Services are not applicable to all individuals, patients or all clinical situations. Any procedures, products, services or devices represented through the Services by advertisers, sponsors, and other participants of the Services, either paid or unpaid, are presented for your awareness and do not necessarily imply, and we make no claims as to, safety or appropriateness for any particular individual or prediction of effectiveness, outcome or success.
</Text>

            <H3 style={termsStyles.mainHeading}>6. YOUR PERSONAL INFORMATION
</H3>
            <Text style={termsStyles.normalText}>{`
              Protecting patient privacy and keeping your information secure are among our biggest priorities. Our Privacy Policy,  details how we may use, share, and maintain the information that you voluntarily share with  ${CURRENT_APP_NAME}, which may include, without limitation, your name, address, social security number and contact information, insurance information, medical history and current medical needs, billing information, and other personally identifiable information (collectively, “Personal Information”). You may elect to enter information into a medical history form (“Medical History Form”) on behalf of yourself or a third party from whom you have authorization to provide such information. You can request (and in doing so, authorize)  ${CURRENT_APP_NAME} to provide this information to your chosen Healthcare Provider. You acknowledge and agree that such information will be reviewed and approved by you or someone authorized by you at the time of your appointment to ensure its accuracy. You also acknowledge that  ${CURRENT_APP_NAME} may use the data or information you provide in a Medical History Form in accordance with our Privacy Policy. `}
            </Text>

            <H3 style={termsStyles.mainHeading}>7. YOUR RESPONSIBILITIES
          </H3>
            < Text style={termsStyles.normalTextWithBold}>
              7.1 Your Account Credentials
         </Text>
            <Text style={termsStyles.normalText}>{`
              When you create a  ${CURRENT_APP_NAME} account, you will provide an email address and create a password (collectively, “Credentials”). You should keep your Credentials private and not share your Credentials with anyone else. You must immediately notify us if your password has been stolen or compromised by sending an email to service@ ${CURRENT_APP_NAME}.com. You may not able to connect to the Services through a third party service, such as Facebook or Google.  ${CURRENT_APP_NAME} has no control over, and assumes no responsibility for, the content, accuracy, privacy policies, or practices of or opinions expressed by any such third party. `}
            </Text>
            < Text style={termsStyles.normalTextWithBold}>
              7.2 Your Responsibilities Generally
         </Text>

            <Text style={termsStyles.normalText}>{`
              The Services are free, but you are still responsible for your healthcare expenses. Usual, customary and any other charges for any medical or related services rendered by Healthcare Providers will apply and will be entirely your responsibility. You are responsible for ensuring that all information that you provide to  ${CURRENT_APP_NAME} is accurate and up-to-date, including your insurance information. Some Services may not be available through  ${CURRENT_APP_NAME} or your Healthcare Provider depending upon a number of factors, including your insurance participation. Ultimately, you must resolve any dispute between you or any Healthcare Provider arising from any transaction hereunder directly with the Healthcare Provider.`}
            </Text>

            <Text style={termsStyles.normalText}>
              You are responsible for all use of the Services and for all use of your Credentials, including use by others to whom you have given your Credentials. You may only use the Site and the Services for lawful, non-commercial purposes. You may not use the Site in any manner that could damage, disable, overburden, or impair our servers or networks, or interfere with any other party’s use and enjoyment of the Site or the Services. You may not attempt to gain unauthorized access to any of the Services, user accounts, or computer systems or networks, through hacking, password mining or any other means. You may not accumulate or index, directly or indirectly, any Content or portion of the Site and/or Services (including, without limitation, Healthcare Provider Content, appointment availability, price information, and Insurance Content) for any purpose whatsoever.
</Text>

            <Text style={termsStyles.normalText}>
              You are also responsible for reviewing and complying with the terms set forth in our
<H3 style={termsStyles.urlStyle}> Acceptable Use Policy
 </H3> .
</Text>

            <Text style={termsStyles.normalText}>
              In addition to our rights in these Terms of Use, we may take any legal action and implement any technological measures to prevent violations of the restrictions hereunder and to enforce these Terms of Use or our Acceptable Use Policy.
</Text>

            < Text style={termsStyles.normalTextWithBold}>
              7.3 Responsibilities of Healthcare Providers and Others in the Healthcare or Medical Industries
         </Text>

            <Text style={termsStyles.normalText}>{`
              If you are a Healthcare Provider or other person or entity in the healthcare or medical industries, regardless of whether you maintain an account with  ${CURRENT_APP_NAME} or whether you schedule or intend to schedule appointments (including appointments for Designated Provider Services, as defined in the Additional Terms) through the Services, you acknowledge and agree that:`}
            </Text>
            <Text style={termsStyles.normalText}>
              (a) You will not use the Services to view, access or otherwise use, directly or indirectly, price, availability, or other Content for any purpose other than your own personal use as a patient or prospective patient.
</Text>
            <Text style={termsStyles.normalText}>
              (b) You will not use the Services to establish, attempt to establish, or enforce, directly or indirectly, any agreement or coordination of the prices charged for any product or service; the kinds, frequencies or amounts of any product or service offered; or the customer or customer categories for any product or service, or otherwise engage or attempt to engage in price fixing, output restriction, or customer or market allocation.
</Text>
            <Text style={termsStyles.normalText}>
              (c) You will not use the Services, directly or indirectly, to engage in any anti-competitive, deceptive or unfair practices, or otherwise violate applicable antitrust, competition or consumer protection laws, or regulations.
</Text>

            <H3 style={termsStyles.mainHeading}>8. CHANGES TO THE SERVICES; NEW SERVICES; ADDITIONAL TERMS
          </H3>
            < Text style={termsStyles.normalTextWithBold}>
              8.1 Changes to the Services; New Services
</Text>
            <Text style={termsStyles.normalText}>{`
              We may from time to time add new features to the Services, substitute a new service for one of the existing Services, or discontinue or suspend one of the existing Services. Under no circumstances will  ${CURRENT_APP_NAME} be liable for any suspension or discontinuation of any of the Services or portion thereof, and the use of new services will be governed by this Agreement.`}
            </Text>

            < Text style={termsStyles.normalTextWithBold}>
              8.2 Additional Terms
</Text>
            <Text style={termsStyles.normalText}>
              Some Services may have additional terms (including, without limitation, policies, guidelines, and rules) that will further govern your use of that particular Service and supplement this Agreement. If you choose to register for, access or use any such Services, you may be presented with such additional terms, which may also be found in the
 <H3 style={termsStyles.urlStyle}> Additional Terms
 </H3>
.  By using those Services, you agree to comply with any such additional terms, which are incorporated by reference into this Agreement.
</Text>

            <H3 style={termsStyles.mainHeading}>9. LINKS TO OTHER WEBSITES
          </H3>
            <Text style={termsStyles.normalText}>
              While using the Services, you may encounter links to other websites. These links are provided for your convenience only and we do not endorse these sites or the products and services they provide. You acknowledge and agree that we are not responsible or liable for the content or accuracy of these other websites. Although we attempt to link to trustworthy websites, it is possible that they will contain materials that are objectionable, unlawful, or inaccurate and we will not be responsible or liable for the legality or decency of material contained in or accessed through such other websites.
</Text>

            <H3 style={termsStyles.mainHeading}>10. CONTENT YOU POST OR SUBMIT
          </H3>
            <Text style={termsStyles.normalText}>
              You will have the opportunity to submit feedback regarding your experiences with Healthcare Providers you find through the Services, to submit inquiries concerning possible medical needs and to participate in the other interactive or community features of the Site (collectively, “Posted Information”). It is important that you act responsibly when providing Posted Information. Your Posted Information must comply with our
<H3 style={termsStyles.urlStyle}> Acceptable Use Policy
</H3> .
</Text>
            <Text style={termsStyles.normalText}>{`
               ${CURRENT_APP_NAME} reserves the right to investigate and, at our discretion, take appropriate legal action against anyone who violates these Terms of Use or the Acceptable Use Policy, including without limitation, removing any offending communication from the Services and terminating the account of such violators or blocking your use of the Services.`}
            </Text>
            <Text style={termsStyles.normalText}>{`
              By posting Posted Information through the Services, you agree to and hereby do grant, and you represent and warrant that you have the right to grant, to  ${CURRENT_APP_NAME} and its contractors an irrevocable, perpetual, royalty-free, fully sublicensable, fully paid up, worldwide license to use, copy, publicly perform, digitally perform, publicly display, and distribute such Posted Information and to adapt, edit, translate, prepare derivative works of, or incorporate into other works, such Posted Information.`}
            </Text>

            <H3 style={termsStyles.mainHeading}>11. YOUR USE OF CONTENT
          </H3>
            <Text style={termsStyles.normalText}>{`
              All of the Content is owned by us or our licensors and is protected by copyright, trademark, patent, and trade secret laws, other proprietary rights, and international treaties. You acknowledge that the Services and any underlying technology or software used in connection with the Services contain  ${CURRENT_APP_NAME} proprietary information. We give you permission to use the Content for personal, non-commercial purposes only and do not transfer any intellectual property rights to you by virtue of permitting your use of the Services. You may print, download, and store information from the Site for your own convenience, but you may not copy, distribute, republish (except as permitted in this paragraph), sell, or exploit any of the Content, or exploit the Site or Services in whole or in part, for any commercial gain or purpose whatsoever. Except as expressly provided herein, neither  ${CURRENT_APP_NAME} nor its suppliers grant you any express or implied rights, and all rights in the Site and the Services not expressly granted by  ${CURRENT_APP_NAME} to you are retained by  ${CURRENT_APP_NAME}.`}
            </Text>

            <H3 style={termsStyles.mainHeading}>12. DISCLAIMER
          </H3>
            <Text style={termsStyles.normalText}>{`
              We created  ${CURRENT_APP_NAME} to improve patients’ healthcare experience, and we want your experience with  ${CURRENT_APP_NAME} to be exceptional. While we work hard to make that happen, you acknowledge that we have no control over, and no duty to take any action regarding: (a) which users gain access to the Site and/or the Services, (b) what Content you access, (c) what effects the Content may have on you, (d) how you may interpret or use the Content, or (e) what actions you may take as a result of having been exposed to the Content. You release us from all liability for you having acquired, you are having not acquired, or your use of Content. We make no representations or warranties regarding suggestions or recommendations of services or products offered or purchased through the Site and/or the Services. We have no special relationship with or fiduciary duty to you. WE PROVIDE THE SERVICES “AS IS” AND “AS AVAILABLE.”`}
            </Text>
            <Text style={termsStyles.capsText}>{`
              " WE MAKE NO EXPRESS OR IMPLIED WARRANTIES OR GUARANTEES ABOUT THE SERVICES. TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE HEREBY DISCLAIM ALL SUCH WARRANTIES, INCLUDING ALL STATUTORY WARRANTIES, WITH RESPECT TO THE SERVICES AND THE SITE, INCLUDING, WITHOUT LIMITATION, ANY WARRANTIES THAT THE SERVICES ARE MERCHANTABLE, OF SATISFACTORY QUALITY, ACCURATE, FIT FOR A PARTICULAR PURPOSE OR NEED, OR NON-INFRINGING. WE DO NOT GUARANTEE THAT THE RESULTS THAT MAY BE OBTAINED FROM THE USE OF THE SERVICES WILL BE EFFECTIVE, RELIABLE OR ACCURATE OR WILL MEET YOUR REQUIREMENTS. WE DO NOT GUARANTEE THAT YOU WILL BE ABLE TO ACCESS OR USE THE SERVICES (EITHER DIRECTLY OR THROUGH THIRD-PARTY NETWORKS) AT TIMES OR LOCATIONS OF YOUR CHOOSING. WE ARE NOT RESPONSIBLE FOR THE ACCURACY, RELIABILITY, TIMELINESS OR COMPLETENESS OF INFORMATION PROVIDED BY USERS OF THE SERVICES OR ANY OTHER DATA OR INFORMATION PROVIDED OR RECEIVED THROUGH THE SERVICES.EXCEPT AS EXPRESSLY SET FORTH HEREIN,  ${CURRENT_APP_NAME} MAKES NO WARRANTIES ABOUT THE INFORMATION SYSTEMS, SOFTWARE AND FUNCTIONS MADE ACCESSIBLE THROUGH THE SERVICES OR ANY OTHER SECURITY ASSOCIATED WITH THE TRANSMISSION OF SENSITIVE INFORMATION.  ${CURRENT_APP_NAME} DOES NOT WARRANT THAT THE SITE OR THE SERVICES WILL OPERATE ERROR-FREE, BUG-FREE OR FREE FROM DEFECTS, THAT LOSS OF DATA WILL NOT OCCUR, OR THAT THE SERVICES, SOFTWARE OR SITE ARE FREE OF COMPUTER VIRUSES, CONTAMINANTS OR OTHER HARMFUL ITEMS. "`}
            </Text>

            <H3 style={termsStyles.mainHeading}>13. GENERAL LIMITATION OF LIABILITY
          </H3>
            <Text style={termsStyles.capsText}>{`
              " WHILE WE’RE ALWAYS IMPROVING, AND WE HOPE YOU HAVE AN EXCELLENT EXPERIENCE WITH  ${CURRENT_APP_NAME}, YOUR SOLE AND EXCLUSIVE REMEDY FOR ANY DISPUTE WITH US IS THE CANCELLATION OF YOUR ACCOUNT. IN NO EVENT SHALL OUR CUMULATIVE LIABILITY TO YOU FOR ANY AND ALL CLAIMS RELATING TO OR ARISING OUT OF YOUR USE OF THE SERVICES OR THE SITE, REGARDLESS OF THE FORM OF ACTION, EXCEED THE GREATER OF: (a) THE TOTAL AMOUNT OF FEES, IF ANY, THAT YOU PAID TO CREATE OR MAINTAIN AN ACCOUNT WITH THE SITE OR THE SERVICES, OR (b) ₹100; EXCEPT THAT, FOR ANY AND ALL CLAIMS RELATING TO OR ARISING OUT OF YOUR USE OF THE TRANSACTION PROCESSING SERVICES (AS DEFINED IN THE ADDITIONAL TERMS), IN NO EVENT SHALL OUR CUMULATIVE LIABILITY THEREOF REGARDLESS OF THE FORM OF ACTION EXCEED THE TOTAL AMOUNT OF TRANSACTION PROCESSING FEES (AS DESCRIBED IN THE ADDITIONAL TERMS), IF ANY, REMITTED TO AND RETAINED BY  ${CURRENT_APP_NAME} FOR PROVIDING TRANSACTION PROCESSING SERVICES FOR APPOINTMENTS MADE BY YOU IN THE THREE (3) MONTHS PRIOR TO THE EVENT GIVING RISE TO THE APPLICABLE CLAIM. "`}
            </Text>

            <Text style={termsStyles.capsText}>
              " IN NO EVENT SHALL WE BE LIABLE TO YOU (OR TO ANY THIRD PARTY CLAIMING UNDER OR THROUGH YOU) FOR ANY INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL OR EXEMPLARY DAMAGES ARISING FROM YOUR USE OF, OR INABILITY TO USE, THE SITE AND/OR THE SERVICES.THESE EXCLUSIONS APPLY TO ANY CLAIMS FOR LOST PROFITS, LOST DATA, LOSS OF GOODWILL, COMPUTER FAILURE OR MALFUNCTION, ANY OTHER COMMERCIAL DAMAGES OR LOSSES, OR MEDICAL MALPRACTICE OR NEGLIGENCE OF HEALTHCARE PROVIDERS UTILIZED THROUGH USE OF THE SERVICES, EVEN IF WE KNEW OR SHOULD HAVE KNOWN OF THE POSSIBILITY OF SUCH DAMAGES. BECAUSE SOME STATES OR JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR THE LIMITATION OF LIABILITY FOR CONSEQUENTIAL OR INCIDENTAL DAMAGES, IN SUCH STATES OR JURISDICTIONS, OUR LIABILITY SHALL BE LIMITED IN ACCORDANCE HEREIN TO THE MAXIMUM EXTENT PERMITTED BY LAW. "
</Text>

            <H3 style={termsStyles.mainHeading}>14. TERMINATION
          </H3>
            <Text style={termsStyles.normalText}>{`
              If you’re not using the Service appropriately, we’ll want to work with you to set things straight. But we reserve the right, if we determine it is best, to terminate, suspend and/or deactivate your account immediately, without notice, if there has been a violation of this Agreement or other policies and terms posted on the Site or through the Services by you or by someone using your Credentials. We may also terminate, suspend or deactivate your account for any other reason, including inactivity for an extended period.  ${CURRENT_APP_NAME} shall not be liable to you or any third party for any termination, suspension or deactivation of your access to the Site and/or the Services. Further, you agree not to attempt to use the Site and/or the Services after any such termination, suspension or deactivation (except where deactivation is due solely to inactivity, and you are permitted to create another account). Sections 1, 2, 3, 4, 6, 8, 10, 11, 12, 13, 14, 15, and 16 shall survive any termination or expiration of these Terms of Use.`}
            </Text>

            <H3 style={termsStyles.mainHeading}>15. INDEMNIFICATION
          </H3>
            <Text style={termsStyles.normalText}>
              Upon a request by us, you agree to defend, indemnify, and hold harmless us, our employees, contractors, officers, directors, agents, parent and other affiliates, from all liabilities, claims, demands and expenses, including attorney’s fees, that arise from or are related to (a) your use of the Site and/or Services, or (b) the violation of this Agreement (including without limitation the Terms of Use, the Acceptable Use Policy, and the Additional Terms), or of any intellectual property or other right of any person or entity, by you or any person using your Credentials. The foregoing indemnification obligation does not apply to liabilities, claims and expenses arising as a result of our own gross negligence or intentional misconduct.
</Text>

            <H3 style={termsStyles.mainHeading}>16. MISCELLANEOUS
          </H3>
            < Text style={termsStyles.normalTextWithBold}>
              16.1 Electronic Contracting; Copyright Dispute
</Text>
            <Text style={termsStyles.normalText}>
              Your affirmative act of using the Services and/or creating an account constitutes your electronic signature to this Agreement, which includes our Privacy Policy, Acceptable Use Policy and Additional Terms, and your consent to enter into such agreements with us electronically.
</Text>

            <Text style={termsStyles.normalText}>
              Please review our
<H3 style={termsStyles.urlStyle}>  Acceptable Use Policy
</H3> for our copyright dispute policy.
</Text>

            < Text style={termsStyles.normalTextWithBold}>
              16.2 Changes to These Terms of Use
</Text>
            <Text style={termsStyles.normalText}>
              We may change these Terms of Use and the other documents that are part of the Agreement at any time, as we reasonably deem appropriate. Upon any such change, we will post the amended terms on the Site; we may also attempt to notify you in some other way. Your continued use of the Site and/or the Services following such posting shall constitute your affirmative acknowledgement of the Terms of Use or other applicable Agreement document, the modification, and agreement to abide and be bound by the Terms of Use or other applicable Agreement document, as amended. We encourage you to periodically review these Terms of Use and the Agreement. IF AT ANY TIME YOU CHOOSE NOT TO ACCEPT THESE TERMS OF USE OR THE AGREEMENT, INCLUDING FOLLOWING ANY SUCH MODIFICATIONS HERETO, THEN YOU MUST STOP USING THE SITE AND THE SERVICES.
</Text>



            < Text style={termsStyles.normalTextWithBold}>
              16.3 Limitation of Claims
</Text>
            <Text style={termsStyles.normalText}>
              No action arising under or in connection with this Agreement, regardless of the form, may be brought by you more than one (1) year after the cause of action arose; actions brought thereafter are forever barred.
</Text>

            < Text style={termsStyles.normalTextWithBold}>
              16.4 Severability
</Text>
            <Text style={termsStyles.normalText}>
              In the event any one or more of the provisions of this Agreement shall for any reason be held to be invalid, illegal or unenforceable, the remaining provisions of this Agreement shall be unimpaired. Further, the invalid, illegal or unenforceable provision shall be replaced by a provision that comes closest to the intention of the parties that underlie the invalid, illegal or unenforceable provision, except to the extent no such provision is valid, legal and enforceable, in which case such invalid, illegal or unenforceable provision shall be limited or eliminated to the minimum extent necessary so that the other provisions of this Agreement remain in full force and effect and enforceable.
</Text>

            < Text style={termsStyles.normalTextWithBold}>
              16.5 Entire Agreement
</Text>
            <Text style={termsStyles.normalText}>{`
              This Agreement and any supplemental terms, policies, rules and guidelines posted through the Services, each of which are incorporated herein by reference, including the Privacy Policy, the Acceptable Use Policy and the Additional Terms, constitute the entire agreement between you and us and supersede all previous written or oral agreements. If any part of this Agreement is held invalid or unenforceable, that portion shall be construed in a manner consistent with applicable law to reflect, as nearly as possible, the original intentions of the parties, and the remaining portions shall remain in full force and effect. The failure of  ${CURRENT_APP_NAME} to exercise or enforce any right or provision of this Agreement shall not constitute a waiver of such right or provision. The failure of either party to exercise in any respect any right provided for herein shall not be deemed a waiver of any further rights hereunder.`}
            </Text>


            < Text style={termsStyles.normalTextWithBold}>
              16.6 Headings
</Text>
            <Text style={termsStyles.normalText}>
              The headings of the sections of this Agreement are for convenience only, do not form a part hereof, and in no way limit, define, describe, modify, interpret or construe the meaning, scope or intent of this Agreement or any terms or conditions therein.
</Text>

            < Text style={termsStyles.normalTextWithBold}>
              16.7 Assignment
</Text>
            <Text style={termsStyles.normalText}>
              We may assign this Agreement at any time, including, without limitation, to any parent, subsidiary, or any affiliated company, or as part of the sale to, merger with, or other transfer of our company to another entity.You may not assign, transfer or sublicense this Agreement to anyone else and any attempt to do so in violation of this section shall be null and void.
</Text>

            < Text style={termsStyles.normalTextWithBold}>
              16.8 Eligibility
</Text>
            <Text style={termsStyles.normalText}>
              You must be 18 years of age or over, or the legal age to form a binding contract in your jurisdiction if that age is greater than 18 years of age, to create an account with us or use the Site and the Services. If you are between the ages of 13 and 18 or the applicable legal age in your jurisdiction, you can use the Site or Services only under the supervision of your parent or guardian who has agreed to these Terms of Use. Those under the age of 13 may not use the Site or Services. Parents or legal guardians of a child under the age of 18 may use the Site or Services on behalf of such minor child. By using the Site or Services on behalf of a minor child, you represent and warrant that you are the parent or legal guardian of such child, and that all references in these Terms of Use to “you” shall refer to such child or such other individual on whose behalf you have authorization to enter into these Terms of Use and you in your capacity as the parent or legal guardian of such child or as the authorized party of such individual.
</Text>

            <Text style={termsStyles.normalText}>
              If you do not qualify under these Terms of Use, do not use the Site or Services. Use of the Services is void where prohibited by applicable law, and the right to access the Site is revoked in such jurisdictions. By using the Site and/or the Services, you represent and warrant that you have the right, authority, and capacity to enter into these Terms of Use. The Site is administered in the India and intended for India users only; any use outside of the India. or use related to activities outside of the India is prohibited and at the user’s own risk. Users are responsible for compliance with any local, state or federal laws applicable to their use of the Services or the Site.
</Text>

            <View style={{ backgroundColor: '#666666', marginTop: 10 }}>
              <Text style={{ textAlign: 'center', fontSize: 15, color: '#fff', paddingTop: 15, paddingBottom: 15 }}>Copyright © 2017 All Direction Source Technologies private limited</Text>

            </View>
          </View>
        </Content>
        <TouchableOpacity style={termsStyles.backButton} onPress={() => this.props.navigation.navigate('signup')}>
          <Text style={{ color: '#fff', fontSize: 13 }}>BACK</Text>
        </TouchableOpacity>
      </Container>
    )
  }
}
const termsStyles = StyleSheet.create({
  normalText: {
    fontSize: 14, marginTop: 10, lineHeight: 25
  },
  normalTextWithBold: {
    fontSize: 15, marginTop: 10, color: 'black'
  },
  urlStyle: {
    fontSize: 14, color: '#5055d7', fontWeight: 'bold', lineHeight: 25
  },
  offlineText: {
    color: '#fff'
  },
  capsText: {
    fontSize: 14, marginTop: 10, lineHeight: 25
  },
  mainHeading: {
    fontSize: 18, marginTop: 20, fontWeight: 'bold'
  },
  backButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    marginRight: 15,
    backgroundColor: primaryColor,
    padding: 12, marginBottom: 12,
    borderRadius: 20,
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 5,
    paddingBottom: 7,
    shadowColor: 'gray',
    elevation: 2
  },
});

export default TermsAndConditions
