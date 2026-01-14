// Seed script to populate services
const servicesData = [
    {
        "name": "Divorce & Family Matters",
        "description": "Get expert legal help for all family and matrimonial matters. Our verified lawyers assist with documentation, representation, and fast resolution.",
        "categories": [
            "Mutual Divorce (6-month process)",
            "Contested Divorce",
            "Child Custody & Visitation",
            "Domestic Violence Cases",
            "Maintenance & Alimony",
            "Dowry Harassment (498A)",
            "Restitution of Conjugal Rights",
            "NRI Divorce Matters"
        ],
        "number": "+91 1234567890"
    },
    {
        "name": "Criminal / Bail / FIR",
        "description": "If you or someone you know is involved in a criminal matter, get immediate legal help. Our criminal lawyers provide fast support for arrests, bail, FIR, and court cases.",
        "categories": [
            "Regular & Anticipatory Bail",
            "FIR Registration / FIR Quash (482)",
            "False FIR / False Accusations",
            "498A Cases",
            "Cheating & Fraud Cases",
            "POCSO / NDPS Matters",
            "Criminal Appeals & Revisions"
        ],
        "number": "+91 1234567890"
    },
    {
        "name": "Property / Land Disputes",
        "description": "Resolve property matters with highly experienced lawyers. Ideal for disputes in Delhi, Noida, Ghaziabad, Gurgaon & Faridabad.",
        "categories": [
            "Illegal Possession / Encroachment",
            "Property Partition / Inheritance",
            "Landlord–Tenant Disputes",
            "Real Estate Builder Fraud",
            "RERA Complaints",
            "Registry / Mutation Issues",
            "Property Verification & Due Diligence"
        ],
        "number": "+91 1234567890"
    },
    {
        "name": "Cheque Bounce",
        "description": "Get strong legal support for cheque bounce matters — from legal notice to filing a 138 case in court.",
        "categories": [
            "Legal Notice for Cheque Bounce",
            "Section 138 Case Filing",
            "Recovery of Money",
            "Defence in Cheque Bounce Cases",
            "Settlement & Mediation",
            "Drafting Complaint / Reply"
        ],
        "number": "+91 1234567890"
    },
    {
        "name": "Traffic Challan",
        "description": "Get your traffic challan disposed quickly with expert legal assistance. Apply now for discount-based challan settlement in Delhi-NCR.",
        "categories": [
            "Challan Discount (Up to 50%)",
            "Court Representation",
            "Notice Review",
            "Commercial Vehicle Challans",
            "Fake/Incorrect Challan Correction"
        ],
        "number": "+91 1234567890"
    },
    {
        "name": "Consumer Complaints",
        "description": "If you have been cheated, overcharged, or received defective goods/services — file a consumer complaint with expert legal support.",
        "categories": [
            "Online Fraud / Cyber Scam",
            "Bank, Insurance, Loan Issues",
            "Defective Products",
            "Poor Service from Companies",
            "Builder Delay / Real Estate Issues",
            "Compensation Claims"
        ],
        "number": "+91 1234567890"
    },
    {
        "name": "Domestic Violence",
        "description": "Get confidential and immediate help for domestic violence matters. Our lawyers handle sensitive cases with complete privacy.",
        "categories": [
            "Protection Orders",
            "Right of Residence",
            "Monetary Relief",
            "Harassment & Abuse Complaints",
            "FIR / Police Protection",
            "Legal Notice & Court Action"
        ],
        "number": "+91 1234567890"
    },
    {
        "name": "Business & Contracts",
        "description": "Perfect for startups, businesses, and individuals needing professional legal drafting, contract review, or dispute resolution.",
        "categories": [
            "Drafting Agreements & Contracts",
            "Partnership Disputes",
            "Company Registration & Compliance",
            "Business Fraud & Recovery",
            "Vendor/Service Disputes",
            "Legal Notices"
        ],
        "number": "+91 1234567890"
    },
    {
        "name": "Civil Disputes",
        "description": "Get help for all types of civil cases, from injunctions to recovery matters.",
        "categories": [
            "Recovery Suits",
            "Injunctions & Stay Orders",
            "Contract Breach",
            "Property/Ownership Disputes",
            "Money Recovery",
            "Civil Appeals"
        ],
        "number": "+91 1234567890"
    },
    {
        "name": "Marriage Registration",
        "description": "Fast and hassle-free court marriage and registration assistance for all types of couples.",
        "categories": [
            "Court Marriage",
            "Special Marriage Act",
            "Arya Samaj Marriage",
            "Inter-caste / Inter-faith Marriage",
            "Marriage Certificate Processing",
            "Document Verification"
        ],
        "number": "+91 1234567890"
    }
];

async function seedServices() {
    const API_URL = 'http://localhost:4000/api/services';

    console.log('🌱 Starting to seed services...\n');

    let successCount = 0;
    let errorCount = 0;

    for (const service of servicesData) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(service),
            });

            const data = await response.json();

            if (response.ok) {
                successCount++;
                console.log(`✅ Created: ${service.name}`);
            } else {
                errorCount++;
                console.log(`❌ Failed: ${service.name} - ${data.message || 'Unknown error'}`);
            }
        } catch (error) {
            errorCount++;
            console.log(`❌ Error: ${service.name} - ${error.message}`);
        }
    }

    console.log('\n📊 Summary:');
    console.log(`✅ Successfully created: ${successCount}`);
    console.log(`❌ Failed: ${errorCount}`);
    console.log(`📦 Total: ${servicesData.length}`);
}

// Run the seed function
seedServices().catch(console.error);
