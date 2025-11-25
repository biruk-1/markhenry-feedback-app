import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateInspectionPDF } from './pdfGenerator';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [savedReports, setSavedReports] = useState([]);
  const [editingReportId, setEditingReportId] = useState(null);
  const [formData, setFormData] = useState({
    // Location Information
    houseNo: '',
    streetName: '',
    ownerName: '',
    borough: '',
    block: '',
    lot: '',
    bin: '',
    communityBoard: '',
    numberOfStories: '',
    numberOfMeters: '',
    activeMeters: '',
    
    // Plumber Information
    plumberFirstName: 'Jozwik',
    plumberLastName: 'Mark',
    plumberMiddleName: 'H',
    plumberCompany: 'Mark Henry Plumbing and Heating Corp',
    plumberPhone: '347 354 2727',
    plumberFax: '',
    plumberAddress: '104-24 Jamaica Ave',
    plumberCity: 'Richmond Hill',
    plumberState: 'NY',
    plumberZip: '11418',
    plumberCellPhone: '718 306 7926',
    plumberEmail: 'markhenryplumbing@gmail.com',
    plumberLicense: '2513',
    
    // Inspection Results
    lmp200TurnedOn: 'yes',
    wornPartsAffectingSafety: 'no',
    wornPartsDetails: '',
    wornPartsIncludePicture: false,
    otherUnsafeConditions: 'no',
    otherUnsafeDetails: '',
    otherUnsafeIncludePicture: false,
    illegalConnections: 'no',
    illegalConnectionsDetails: '',
    illegalConnectionsIncludePicture: false,
    gasLeak: 'no',
    gasLeakDetails: '',
    gasLeakIncludePicture: false,
    improperFlexHose: 'no',
    improperFlexHoseDetails: '',
    improperFlexHoseIncludePicture: false,
    illegalConnections2: 'no',
    illegalConnections2Details: '',
    illegalConnections2IncludePicture: false,
    
    // Additional Comments
    additionalComments: '',
    additionalCommentsIncludePicture: false,
    
    // Certifications
    inspectionDate: '',
    certificationOption: '',
    noGasPiping: false,
    personalInspection: false,
    directSupervision: false,
  });

  // Load saved reports on mount
  useEffect(() => {
    loadSavedReports();
  }, []);

  const loadSavedReports = async () => {
    try {
      const reports = await AsyncStorage.getItem('gasInspectionReports');
      if (reports) {
        setSavedReports(JSON.parse(reports));
      }
    } catch (error) {
      console.error('Error loading reports:', error);
    }
  };

  const saveReport = async (report) => {
    try {
      const reportWithId = {
        ...report,
        id: editingReportId || Date.now().toString(),
        savedDate: new Date().toISOString(),
      };

      let updatedReports;
      if (editingReportId) {
        // Update existing report
        updatedReports = savedReports.map(r => r.id === editingReportId ? reportWithId : r);
      } else {
        // Add new report
        updatedReports = [...savedReports, reportWithId];
      }

      await AsyncStorage.setItem('gasInspectionReports', JSON.stringify(updatedReports));
      setSavedReports(updatedReports);
      return reportWithId;
    } catch (error) {
      console.error('Error saving report:', error);
      throw error;
    }
  };

  const deleteReport = async (reportId) => {
    try {
      const updatedReports = savedReports.filter(r => r.id !== reportId);
      await AsyncStorage.setItem('gasInspectionReports', JSON.stringify(updatedReports));
      setSavedReports(updatedReports);
    } catch (error) {
      console.error('Error deleting report:', error);
    }
  };

  const loadReportForEditing = (report) => {
    setEditingReportId(report.id);
    setFormData(report);
    setCurrentScreen('location');
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const navigateNext = () => {
    const screens = ['home', 'location', 'plumber', 'inspection1', 'inspection2', 'comments', 'certifications'];
    const currentIndex = screens.indexOf(currentScreen);
    if (currentIndex < screens.length - 1) {
      setCurrentScreen(screens[currentIndex + 1]);
    }
  };

  const navigateBack = () => {
    const screens = ['home', 'location', 'plumber', 'inspection1', 'inspection2', 'comments', 'certifications'];
    const currentIndex = screens.indexOf(currentScreen);
    if (currentIndex > 0) {
      setCurrentScreen(screens[currentIndex - 1]);
    }
  };

  const generatePDF = async () => {
    try {
      // Validate required fields
      if (!formData.houseNo || !formData.streetName || !formData.ownerName) {
        Alert.alert('Missing Information', 'Please fill in all required location information.');
        return;
      }

      // Save the report first
      const savedReport = await saveReport(formData);

      // Ask user how they want to share the PDF
      Alert.alert(
        'Report Saved Successfully!',
        'How would you like to share the PDF report?',
        [
          {
            text: 'Email PDF',
            onPress: async () => {
              try {
                Alert.alert('Generating PDF', 'Please wait...', [], { cancelable: false });
                await generateInspectionPDF(formData, true);
                setTimeout(() => {
                  Alert.alert(
                    'Email Ready',
                    'Email composer opened with PDF attached. Send it to your email.',
                    [{ text: 'OK', onPress: () => {
                      setCurrentScreen('home');
                      setEditingReportId(null);
                      resetFormData();
                    }}]
                  );
                }, 500);
              } catch (error) {
                Alert.alert('Error', 'Failed to open email: ' + error.message);
              }
            },
          },
          {
            text: 'Share PDF',
            onPress: async () => {
              try {
                Alert.alert('Generating PDF', 'Please wait...', [], { cancelable: false });
                await generateInspectionPDF(formData, false);
                setTimeout(() => {
                  Alert.alert(
                    'PDF Ready',
                    'Choose how to share your PDF report.',
                    [{ text: 'OK', onPress: () => {
                      setCurrentScreen('home');
                      setEditingReportId(null);
                      resetFormData();
                    }}]
                  );
                }, 500);
              } catch (error) {
                Alert.alert('Error', 'Failed to generate PDF: ' + error.message);
              }
            },
          },
          {
            text: 'Later',
            onPress: () => {
              Alert.alert(
                'Report Saved',
                'You can generate the PDF later from "Edit Report".',
                [{ text: 'OK', onPress: () => {
                  setCurrentScreen('home');
                  setEditingReportId(null);
                  resetFormData();
                }}]
              );
            },
            style: 'cancel',
          },
        ]
      );
    } catch (error) {
      console.error('Error in generatePDF:', error);
      Alert.alert('Error', 'Failed to save report. Please try again.');
    }
  };

  const resetFormData = () => {
    setFormData({
      // Location Information
      houseNo: '',
      streetName: '',
      ownerName: '',
      borough: '',
      block: '',
      lot: '',
      bin: '',
      communityBoard: '',
      numberOfStories: '',
      numberOfMeters: '',
      activeMeters: '',
      
      // Plumber Information (keep defaults)
      plumberFirstName: 'Jozwik',
      plumberLastName: 'Mark',
      plumberMiddleName: 'H',
      plumberCompany: 'Mark Henry Plumbing and Heating Corp',
      plumberPhone: '347 354 2727',
      plumberFax: '',
      plumberAddress: '104-24 Jamaica Ave',
      plumberCity: 'Richmond Hill',
      plumberState: 'NY',
      plumberZip: '11418',
      plumberCellPhone: '718 306 7926',
      plumberEmail: 'markhenryplumbing@gmail.com',
      plumberLicense: '2513',
      
      // Inspection Results (reset to defaults)
      lmp200TurnedOn: 'yes',
      wornPartsAffectingSafety: 'no',
      wornPartsDetails: '',
      wornPartsIncludePicture: false,
      otherUnsafeConditions: 'no',
      otherUnsafeDetails: '',
      otherUnsafeIncludePicture: false,
      illegalConnections: 'no',
      illegalConnectionsDetails: '',
      illegalConnectionsIncludePicture: false,
      gasLeak: 'no',
      gasLeakDetails: '',
      gasLeakIncludePicture: false,
      improperFlexHose: 'no',
      improperFlexHoseDetails: '',
      improperFlexHoseIncludePicture: false,
      illegalConnections2: 'no',
      illegalConnections2Details: '',
      illegalConnections2IncludePicture: false,
      
      // Additional Comments
      additionalComments: '',
      additionalCommentsIncludePicture: false,
      
      // Certifications
      inspectionDate: '',
      certificationOption: '',
      noGasPiping: false,
      personalInspection: false,
      directSupervision: false,
    });
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onNavigate={setCurrentScreen} />;
      case 'reportsList':
        return <ReportsListScreen 
          reports={savedReports} 
          onEdit={loadReportForEditing}
          onDelete={deleteReport}
          onBack={() => setCurrentScreen('home')}
          onGeneratePDF={(report, emailDirectly) => generateInspectionPDF(report, emailDirectly)}
        />;
      case 'location':
        return <LocationScreen formData={formData} updateFormData={updateFormData} onNext={navigateNext} onBack={() => {
          setCurrentScreen('home');
          setEditingReportId(null);
          resetFormData();
        }} />;
      case 'plumber':
        return <PlumberScreen formData={formData} updateFormData={updateFormData} onNext={navigateNext} onBack={navigateBack} />;
      case 'inspection1':
        return <InspectionScreen1 formData={formData} updateFormData={updateFormData} onNext={navigateNext} onBack={navigateBack} />;
      case 'inspection2':
        return <InspectionScreen2 formData={formData} updateFormData={updateFormData} onNext={navigateNext} onBack={navigateBack} />;
      case 'comments':
        return <CommentsScreen formData={formData} updateFormData={updateFormData} onNext={navigateNext} onBack={navigateBack} />;
      case 'certifications':
        return <CertificationsScreen formData={formData} updateFormData={updateFormData} onBack={navigateBack} onSubmit={generatePDF} />;
      default:
        return <HomeScreen onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderScreen()}
    </SafeAreaView>
  );
};

// Home Screen Component
const HomeScreen = ({ onNavigate }) => {
  return (
    <View style={styles.homeContainer}>
      <View style={styles.header}>
        <Text style={styles.menuIcon}>☰</Text>
        <Text style={styles.headerTitle}>Mark Henry LL152</Text>
        <Text style={styles.refreshIcon}>⟳</Text>
      </View>
      
      <ScrollView 
        style={styles.homeScrollView}
        contentContainerStyle={styles.homeScrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.welcomeSection}>
          <View style={styles.userIcon}>
            <Text style={styles.userIconText}>👤</Text>
          </View>
          <Text style={styles.welcomeText}>Welcome!</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.homeButton}
            onPress={() => onNavigate('location')}
          >
            <Text style={styles.homeButtonIcon}>📄</Text>
            <Text style={styles.homeButtonText}>Create Report</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.homeButton}
            onPress={() => onNavigate('reportsList')}
          >
            <Text style={styles.homeButtonIcon}>✏️</Text>
            <Text style={styles.homeButtonText}>Edit Report</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.homeButton, styles.wideButton]}>
            <Text style={styles.homeButtonIcon}>📶</Text>
            <Text style={styles.homeButtonText}>Download From LMP - Coming Soon</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.homeButton, styles.wideButton]}>
            <Text style={styles.homeButtonIcon}>👤</Text>
            <Text style={styles.homeButtonText}>Edit Account Info</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

// Reports List Screen Component
const ReportsListScreen = ({ reports, onEdit, onDelete, onBack, onGeneratePDF }) => {
  const handleDelete = (reportId) => {
    Alert.alert(
      'Delete Report',
      'Are you sure you want to delete this report?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => onDelete(reportId)
        },
      ]
    );
  };

  const handleGeneratePDF = async (report, emailDirectly = false) => {
    try {
      const action = emailDirectly ? 'Sending Email' : 'Generating PDF';
      Alert.alert(
        action,
        'Please wait...',
        [],
        { cancelable: false }
      );
      await onGeneratePDF(report, emailDirectly);
      
      setTimeout(() => {
        if (emailDirectly) {
          Alert.alert('Email Ready', 'Email composer opened with the PDF attached. You can now send it to your email address.');
        } else {
          Alert.alert('Success', 'PDF generated! Choose how to share it.');
        }
      }, 500);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate PDF: ' + error.message);
    }
  };

  const renderReportItem = ({ item }) => (
    <View style={styles.reportCard}>
      <View style={styles.reportCardHeader}>
        <Text style={styles.reportCardTitle}>{item.ownerName || 'Unnamed Report'}</Text>
        <Text style={styles.reportCardDate}>
          {new Date(item.savedDate).toLocaleDateString()}
        </Text>
      </View>
      <Text style={styles.reportCardAddress}>
        {item.houseNo} {item.streetName}
      </Text>
      <Text style={styles.reportCardDetails}>
        Borough: {item.borough || 'N/A'} • Block: {item.block || 'N/A'} • Lot: {item.lot || 'N/A'}
      </Text>
      <View style={styles.reportCardActions}>
        <TouchableOpacity 
          style={[styles.reportActionButton, styles.editButton]}
          onPress={() => onEdit(item)}
        >
          <Text style={styles.reportActionText}>✏️ Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.reportActionButton, styles.emailButton]}
          onPress={() => handleGeneratePDF(item, true)}
        >
          <Text style={styles.reportActionText}>📧 Email</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.reportCardActions}>
        <TouchableOpacity 
          style={[styles.reportActionButton, styles.shareButton]}
          onPress={() => handleGeneratePDF(item, false)}
        >
          <Text style={styles.reportActionText}>📤 Share PDF</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.reportActionButton, styles.deleteButton]}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={[styles.reportActionText, styles.deleteButtonText]}>🗑️ Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.screenContainer}>
      <View style={styles.navigationHeader}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backButton}>◀ BACK</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>Saved Reports</Text>
        <View style={{ width: 50 }} />
      </View>

      {reports.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateIcon}>📋</Text>
          <Text style={styles.emptyStateText}>No saved reports yet</Text>
          <Text style={styles.emptyStateSubtext}>Create your first report to get started</Text>
        </View>
      ) : (
        <FlatList
          data={reports}
          renderItem={renderReportItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.reportsList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

// Location Information Screen
const LocationScreen = ({ formData, updateFormData, onNext, onBack }) => {
  return (
    <KeyboardAvoidingView 
      style={styles.screenContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={styles.navigationHeader}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backButton}>◀ BACK</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>Location Information</Text>
        <TouchableOpacity style={styles.nextButton} onPress={onNext}>
          <Text style={styles.nextButtonText}>NEXT ▶</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TextInput
          style={styles.input}
          placeholder="House No(s)"
          value={formData.houseNo}
          onChangeText={(text) => updateFormData('houseNo', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Street Name"
          value={formData.streetName}
          onChangeText={(text) => updateFormData('streetName', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Owner Name"
          value={formData.ownerName}
          onChangeText={(text) => updateFormData('ownerName', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Borough"
          value={formData.borough}
          onChangeText={(text) => updateFormData('borough', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Block"
          value={formData.block}
          onChangeText={(text) => updateFormData('block', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Lot"
          value={formData.lot}
          onChangeText={(text) => updateFormData('lot', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="BIN"
          value={formData.bin}
          onChangeText={(text) => updateFormData('bin', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Community Board No."
          value={formData.communityBoard}
          onChangeText={(text) => updateFormData('communityBoard', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Number of Stories"
          value={formData.numberOfStories}
          onChangeText={(text) => updateFormData('numberOfStories', text)}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Number of Meters"
          value={formData.numberOfMeters}
          onChangeText={(text) => updateFormData('numberOfMeters', text)}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Active Meters"
          value={formData.activeMeters}
          onChangeText={(text) => updateFormData('activeMeters', text)}
          keyboardType="numeric"
        />
        
        {/* Bottom Next Button */}
        <TouchableOpacity style={styles.bottomNextButton} onPress={onNext}>
          <Text style={styles.bottomNextButtonText}>NEXT ▶</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Plumber Information Screen
const PlumberScreen = ({ formData, updateFormData, onNext, onBack }) => {
  return (
    <KeyboardAvoidingView 
      style={styles.screenContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={styles.navigationHeader}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backButton}>◀ BACK</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>Plumber Info</Text>
        <TouchableOpacity style={styles.nextButton} onPress={onNext}>
          <Text style={styles.nextButtonText}>NEXT ▶</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={formData.plumberFirstName}
          onChangeText={(text) => updateFormData('plumberFirstName', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={formData.plumberLastName}
          onChangeText={(text) => updateFormData('plumberLastName', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Middle Name"
          value={formData.plumberMiddleName}
          onChangeText={(text) => updateFormData('plumberMiddleName', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Company Name"
          value={formData.plumberCompany}
          onChangeText={(text) => updateFormData('plumberCompany', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={formData.plumberPhone}
          onChangeText={(text) => updateFormData('plumberPhone', text)}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Business Fax"
          value={formData.plumberFax}
          onChangeText={(text) => updateFormData('plumberFax', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={formData.plumberAddress}
          onChangeText={(text) => updateFormData('plumberAddress', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="City"
          value={formData.plumberCity}
          onChangeText={(text) => updateFormData('plumberCity', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="State"
          value={formData.plumberState}
          onChangeText={(text) => updateFormData('plumberState', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Zip Code"
          value={formData.plumberZip}
          onChangeText={(text) => updateFormData('plumberZip', text)}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Cell Phone"
          value={formData.plumberCellPhone}
          onChangeText={(text) => updateFormData('plumberCellPhone', text)}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={formData.plumberEmail}
          onChangeText={(text) => updateFormData('plumberEmail', text)}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="License Number"
          value={formData.plumberLicense}
          onChangeText={(text) => updateFormData('plumberLicense', text)}
        />
        
        {/* Bottom Next Button */}
        <TouchableOpacity style={styles.bottomNextButton} onPress={onNext}>
          <Text style={styles.bottomNextButtonText}>NEXT ▶</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Inspection Screen 1
const InspectionScreen1 = ({ formData, updateFormData, onNext, onBack }) => {
  return (
    <KeyboardAvoidingView 
      style={styles.screenContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={styles.navigationHeader}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backButton}>◀ BACK</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>Inspection Results</Text>
        <TouchableOpacity style={styles.nextButton} onPress={onNext}>
          <Text style={styles.nextButtonText}>NEXT ▶</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Include Picture?</Text>
          <Switch
            value={formData.wornPartsIncludePicture}
            onValueChange={(value) => updateFormData('wornPartsIncludePicture', value)}
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>Worn Part(s) Affecting Safe and Reliable Operation</Text>
        </View>

        <TouchableOpacity
          style={[styles.radioOption, formData.wornPartsAffectingSafety === 'no' && styles.radioSelected]}
          onPress={() => updateFormData('wornPartsAffectingSafety', 'no')}
        >
          <Text style={styles.radioText}>No Condition(s) Observed</Text>
          <View style={[styles.radioCircle, formData.wornPartsAffectingSafety === 'no' && styles.radioCircleSelected]} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.radioOption, formData.wornPartsAffectingSafety === 'yes' && styles.radioSelected]}
          onPress={() => updateFormData('wornPartsAffectingSafety', 'yes')}
        >
          <Text style={styles.radioText}>Condition(s) Observed</Text>
          <View style={[styles.radioCircle, formData.wornPartsAffectingSafety === 'yes' && styles.radioCircleSelected]} />
        </TouchableOpacity>

        <TextInput
          style={styles.textArea}
          placeholder="Conditions Observed"
          value={formData.wornPartsDetails}
          onChangeText={(text) => updateFormData('wornPartsDetails', text)}
          multiline
        />

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Include Picture?</Text>
          <Switch
            value={formData.otherUnsafeIncludePicture}
            onValueChange={(value) => updateFormData('otherUnsafeIncludePicture', value)}
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>Other Unsafe Condition(s)</Text>
        </View>

        <TouchableOpacity
          style={[styles.radioOption, formData.otherUnsafeConditions === 'no' && styles.radioSelected]}
          onPress={() => updateFormData('otherUnsafeConditions', 'no')}
        >
          <Text style={styles.radioText}>No Condition(s) Observed</Text>
          <View style={[styles.radioCircle, formData.otherUnsafeConditions === 'no' && styles.radioCircleSelected]} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.radioOption, formData.otherUnsafeConditions === 'yes' && styles.radioSelected]}
          onPress={() => updateFormData('otherUnsafeConditions', 'yes')}
        >
          <Text style={styles.radioText}>Condition(s) Observed</Text>
          <View style={[styles.radioCircle, formData.otherUnsafeConditions === 'yes' && styles.radioCircleSelected]} />
        </TouchableOpacity>

        <TextInput
          style={styles.textArea}
          placeholder="Conditions Observed"
          value={formData.otherUnsafeDetails}
          onChangeText={(text) => updateFormData('otherUnsafeDetails', text)}
          multiline
        />
        
        {/* Bottom Next Button */}
        <TouchableOpacity style={styles.bottomNextButton} onPress={onNext}>
          <Text style={styles.bottomNextButtonText}>NEXT ▶</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Inspection Screen 2
const InspectionScreen2 = ({ formData, updateFormData, onNext, onBack }) => {
  return (
    <KeyboardAvoidingView 
      style={styles.screenContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={styles.navigationHeader}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backButton}>◀ BACK</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>Inspection Results</Text>
        <TouchableOpacity style={styles.nextButton} onPress={onNext}>
          <Text style={styles.nextButtonText}>NEXT ▶</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>Did you turn on your Lmp200 outside of the building?</Text>
        </View>

        <TouchableOpacity
          style={[styles.radioOption, formData.lmp200TurnedOn === 'yes' && styles.radioSelected]}
          onPress={() => updateFormData('lmp200TurnedOn', 'yes')}
        >
          <Text style={styles.radioText}>Yes</Text>
          <View style={[styles.radioCircle, formData.lmp200TurnedOn === 'yes' && styles.radioCircleSelected]} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.radioOption, formData.lmp200TurnedOn === 'no' && styles.radioSelected]}
          onPress={() => updateFormData('lmp200TurnedOn', 'no')}
        >
          <Text style={styles.radioText}>No</Text>
          <View style={[styles.radioCircle, formData.lmp200TurnedOn === 'no' && styles.radioCircleSelected]} />
        </TouchableOpacity>

        <Text style={styles.helpText}>If no, please go outside and restart the Lmp200 in fresh air</Text>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Include Picture?</Text>
          <Switch
            value={formData.improperFlexHoseIncludePicture}
            onValueChange={(value) => updateFormData('improperFlexHoseIncludePicture', value)}
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>Improper Use of Flex Hose</Text>
        </View>

        <TouchableOpacity
          style={[styles.radioOption, formData.improperFlexHose === 'no' && styles.radioSelected]}
          onPress={() => updateFormData('improperFlexHose', 'no')}
        >
          <Text style={styles.radioText}>No Condition(s) Observed</Text>
          <View style={[styles.radioCircle, formData.improperFlexHose === 'no' && styles.radioCircleSelected]} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.radioOption, formData.improperFlexHose === 'yes' && styles.radioSelected]}
          onPress={() => updateFormData('improperFlexHose', 'yes')}
        >
          <Text style={styles.radioText}>Condition(s) Observed</Text>
          <View style={[styles.radioCircle, formData.improperFlexHose === 'yes' && styles.radioCircleSelected]} />
        </TouchableOpacity>

        <TextInput
          style={styles.textArea}
          placeholder="Conditions Observed"
          value={formData.improperFlexHoseDetails}
          onChangeText={(text) => updateFormData('improperFlexHoseDetails', text)}
          multiline
        />

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Include Picture?</Text>
          <Switch
            value={formData.illegalConnections2IncludePicture}
            onValueChange={(value) => updateFormData('illegalConnections2IncludePicture', value)}
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>Evidence of illegal connections / non-code compliant installations</Text>
        </View>

        <TouchableOpacity
          style={[styles.radioOption, formData.illegalConnections2 === 'no' && styles.radioSelected]}
          onPress={() => updateFormData('illegalConnections2', 'no')}
        >
          <Text style={styles.radioText}>No Condition(s) Observed</Text>
          <View style={[styles.radioCircle, formData.illegalConnections2 === 'no' && styles.radioCircleSelected]} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.radioOption, formData.illegalConnections2 === 'yes' && styles.radioSelected]}
          onPress={() => updateFormData('illegalConnections2', 'yes')}
        >
          <Text style={styles.radioText}>Condition(s) Observed</Text>
          <View style={[styles.radioCircle, formData.illegalConnections2 === 'yes' && styles.radioCircleSelected]} />
        </TouchableOpacity>

        <TextInput
          style={styles.textArea}
          placeholder="Conditions Observed"
          value={formData.illegalConnections2Details}
          onChangeText={(text) => updateFormData('illegalConnections2Details', text)}
          multiline
        />
        
        {/* Bottom Next Button */}
        <TouchableOpacity style={styles.bottomNextButton} onPress={onNext}>
          <Text style={styles.bottomNextButtonText}>NEXT ▶</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Comments Screen
const CommentsScreen = ({ formData, updateFormData, onNext, onBack }) => {
  return (
    <KeyboardAvoidingView 
      style={styles.screenContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={styles.navigationHeader}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backButton}>◀ BACK</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>Additional Comments</Text>
        <TouchableOpacity style={styles.nextButton} onPress={onNext}>
          <Text style={styles.nextButtonText}>NEXT ▶</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TextInput
          style={[styles.textArea, { height: 200 }]}
          placeholder="Please enter any additional comments"
          value={formData.additionalComments}
          onChangeText={(text) => updateFormData('additionalComments', text)}
          multiline
        />

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Include Picture?</Text>
          <Switch
            value={formData.additionalCommentsIncludePicture}
            onValueChange={(value) => updateFormData('additionalCommentsIncludePicture', value)}
          />
        </View>
        
        {/* Bottom Next Button */}
        <TouchableOpacity style={styles.bottomNextButton} onPress={onNext}>
          <Text style={styles.bottomNextButtonText}>NEXT ▶</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Certifications Screen
const CertificationsScreen = ({ formData, updateFormData, onBack, onSubmit }) => {
  return (
    <KeyboardAvoidingView 
      style={styles.screenContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={styles.navigationHeader}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backButton}>◀ BACK</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>Certifications</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={styles.checkboxOption}
          onPress={() => updateFormData('noGasPiping', !formData.noGasPiping)}
        >
          <View style={[styles.checkbox, formData.noGasPiping && styles.checkboxChecked]} />
          <Text style={styles.checkboxText}>
            I certify that the inspsected building contains no gas piping system
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkboxOption}
          onPress={() => updateFormData('personalInspection', !formData.personalInspection)}
        >
          <View style={[styles.checkbox, formData.personalInspection && styles.checkboxChecked]} />
          <Text style={styles.checkboxText}>
            I certify that I have personally performed an inspection pursuant to Article 318 of Title 28 of the NYC Administrative Code for the inspected building
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkboxOption}
          onPress={() => updateFormData('directSupervision', !formData.directSupervision)}
        >
          <View style={[styles.checkbox, formData.directSupervision && styles.checkboxChecked]} />
          <Text style={styles.checkboxText}>
            I certify that I exercised direct and continuing supervision over the individual identified in Section 3 who performed the required inspection in accordance with Article 318 of Title 28 of the NYC Administrative Code for the inspected building.
          </Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Date of initial inspection:"
          value={formData.inspectionDate}
          onChangeText={(text) => updateFormData('inspectionDate', text)}
        />

        <Text style={styles.sectionTitle}>Check all that apply:</Text>

        <TouchableOpacity
          style={styles.checkboxOption}
          onPress={() => updateFormData('certificationOption', 'noConditions')}
        >
          <View style={[styles.checkbox, formData.certificationOption === 'noConditions' && styles.checkboxChecked]} />
          <Text style={styles.checkboxText}>
            No conditions requiring correction were identified in the Gas Piping System Periodic Report provided to the building owner
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkboxOption}
          onPress={() => updateFormData('certificationOption', 'conditionsIdentified')}
        >
          <View style={[styles.checkbox, formData.certificationOption === 'conditionsIdentified' && styles.checkboxChecked]} />
          <Text style={styles.checkboxText}>
            Conditions requiring correction were identified in the Gas Piping System Periodic Inspection Report provided to the building owner
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkboxOption}
          onPress={() => updateFormData('certificationOption', 'additionalTime')}
        >
          <View style={[styles.checkbox, formData.certificationOption === 'additionalTime' && styles.checkboxChecked]} />
          <Text style={styles.checkboxText}>
            Correction of one or more conditions identified in the Gas Piping System Periodic Inspection Report provided to the building owner will take additional time
            (Certification stating all conditions have been corrected must be submitted to the department within 180 days of the original inspection date)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkboxOption}
          onPress={() => updateFormData('certificationOption', 'allCorrected')}
        >
          <View style={[styles.checkbox, formData.certificationOption === 'allCorrected' && styles.checkboxChecked]} />
          <Text style={styles.checkboxText}>
            All conditions identified in the Gas Piping System Periodic Report provided to the building owner have been corrected
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={onSubmit}>
          <Text style={styles.saveButtonText}>SAVE REPORT</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  homeContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  homeScrollView: {
    flex: 1,
  },
  homeScrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === 'ios' ? 12 : 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    minHeight: 60,
  },
  menuIcon: {
    fontSize: 24,
    color: '#666',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  refreshIcon: {
    fontSize: 24,
    color: '#2196F3',
  },
  welcomeSection: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  userIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userIconText: {
    fontSize: 40,
    color: '#fff',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonContainer: {
    paddingHorizontal: 20,
  },
  homeButton: {
    backgroundColor: '#2196F3',
    padding: 20,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wideButton: {
    width: '100%',
  },
  homeButtonIcon: {
    fontSize: 24,
    marginRight: 12,
    color: '#fff',
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  screenContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  navigationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === 'ios' ? 12 : 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    minHeight: 60,
  },
  backButton: {
    fontSize: 16,
    color: '#666',
  },
  navTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  nextButton: {
    paddingHorizontal: 8,
  },
  nextButtonText: {
    fontSize: 16,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
    paddingBottom: 40,
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectText: {
    fontSize: 16,
    color: '#333',
  },
  selectArrow: {
    position: 'absolute',
    right: 16,
    top: 16,
    fontSize: 14,
    color: '#999',
  },
  textArea: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  sectionHeader: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  sectionHeaderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  radioOption: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  radioSelected: {
    backgroundColor: '#e3f2fd',
  },
  radioText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#999',
  },
  radioCircleSelected: {
    borderColor: '#2196F3',
    backgroundColor: '#2196F3',
  },
  checkboxOption: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#999',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  checkboxText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    lineHeight: 20,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  helpText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 40,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // Reports List Styles
  reportsList: {
    padding: 16,
    paddingBottom: 40,
  },
  reportCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reportCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reportCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  reportCardDate: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  reportCardAddress: {
    fontSize: 15,
    color: '#555',
    marginBottom: 4,
  },
  reportCardDetails: {
    fontSize: 13,
    color: '#777',
    marginBottom: 12,
  },
  reportCardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 8,
  },
  reportActionButton: {
    flex: 1,
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  reportActionText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  editButton: {
    backgroundColor: '#2196F3',
  },
  emailButton: {
    backgroundColor: '#4CAF50',
  },
  shareButton: {
    backgroundColor: '#FF9800',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  deleteButtonText: {
    color: '#fff',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  // Bottom Next Button
  bottomNextButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  bottomNextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default App;
