
package FitnessTracker.example.Project.controller;

import FitnessTracker.example.Project.entity.Contact;
import FitnessTracker.example.Project.entity.User;
import FitnessTracker.example.Project.repository.ContactRepository;
import FitnessTracker.example.Project.repository.UserRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contacts")
@CrossOrigin("*")
public class ContactController {

    private final ContactRepository contactRepository;
    private final UserRepository userRepository;

    public ContactController(ContactRepository contactRepository,
                             UserRepository userRepository) {
        this.contactRepository = contactRepository;
        this.userRepository = userRepository;
    }

    // ✅ GET USER FROM JWT
    private User getUser(HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ✅ SECURITY CHECK
    private Contact getContactIfAuthorized(String contactId, String userId) {
        Contact contact = contactRepository.findById(contactId)
                .orElseThrow(() -> new RuntimeException("Contact not found"));

        if (!contact.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        return contact;
    }

    // ✅ CREATE
    @PostMapping
    public Contact createContact(HttpServletRequest request,
                                 @RequestBody Contact contact) {

        User user = getUser(request);
        contact.setUser(user);
        return contactRepository.save(contact);
    }

    // ✅ GET ALL
//    @GetMapping
//    public List<Contact> getAllContacts(HttpServletRequest request) {
//        User user = getUser(request);
//        return contactRepository.findByUserId(user.getId());
//    }

//    @GetMapping
//    public Page<Contact> getAllContacts(
//            HttpServletRequest request,
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "10") int size
//    ) {
//        User user = getUser(request);
//
//        Pageable pageable = PageRequest.of(page, size);
//
//        return contactRepository.findByUserId(user.getId(), pageable);
//    }

    @GetMapping
    public Map<String, Object> getAllContacts(
            HttpServletRequest request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size
    ) {
        User user = getUser(request);

        Pageable pageable = PageRequest.of(page, size);

        Page<Contact> contactPage =
                contactRepository.findByUserId(user.getId(), pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("content", contactPage.getContent());
        response.put("totalPages", contactPage.getTotalPages());
        response.put("totalElements", contactPage.getTotalElements());
        response.put("currentPage", contactPage.getNumber());

        return response;
    }

    // ✅ GET BY ID
    @GetMapping("/{id}")
    public Contact getContact(@PathVariable String id,
                              HttpServletRequest request) {

        String userId = (String) request.getAttribute("userId");
        return getContactIfAuthorized(id, userId);
    }

    // ✅ UPDATE
    @PutMapping("/{id}")
    public Contact updateContact(@PathVariable String id,
                                 HttpServletRequest request,
                                 @RequestBody Contact updatedContact) {

        String userId = (String) request.getAttribute("userId");
        Contact existing = getContactIfAuthorized(id, userId);

        updatedContact.setId(id);
        updatedContact.setUser(existing.getUser());

        return contactRepository.save(updatedContact);
    }

    // ✅ DELETE
    @DeleteMapping("/{id}")
    public void deleteContact(@PathVariable String id,
                              HttpServletRequest request) {

        String userId = (String) request.getAttribute("userId");
        Contact contact = getContactIfAuthorized(id, userId);

        contactRepository.delete(contact);
    }

    // ✅ ARCHIVE
    @PutMapping("/archive/{id}")
    public Contact archive(@PathVariable String id,
                           HttpServletRequest request) {

        String userId = (String) request.getAttribute("userId");
        Contact contact = getContactIfAuthorized(id, userId);

        contact.setArchived(true);
        return contactRepository.save(contact);
    }

    // ✅ UNARCHIVE
    @PutMapping("/unarchive/{id}")
    public Contact unarchive(@PathVariable String id,
                             HttpServletRequest request) {

        String userId = (String) request.getAttribute("userId");
        Contact contact = getContactIfAuthorized(id, userId);

        contact.setArchived(false);
        return contactRepository.save(contact);
    }

    // ✅ FAVORITE
    @PutMapping("/favorite/{id}")
    public Contact toggleFavorite(@PathVariable String id,
                                  HttpServletRequest request) {

        String userId = (String) request.getAttribute("userId");
        Contact contact = getContactIfAuthorized(id, userId);

        contact.setFavorite(!Boolean.TRUE.equals(contact.getFavorite()));
        return contactRepository.save(contact);
    }

    // ✅ PIN
    @PutMapping("/pin/{id}")
    public Contact togglePin(@PathVariable String id,
                             HttpServletRequest request) {

        String userId = (String) request.getAttribute("userId");
        Contact contact = getContactIfAuthorized(id, userId);

        contact.setPinned(!Boolean.TRUE.equals(contact.getPinned()));
        return contactRepository.save(contact);
    }

    // ✅ GET ARCHIVED
//    @GetMapping("/archived")
//    public List<Contact> getArchived(HttpServletRequest request) {
//        User user = getUser(request);
//
//        return contactRepository.findByUserId(user.getId())
//                .stream()
//                .filter(c -> Boolean.TRUE.equals(c.getArchived()))
//                .toList();
//    }
//




    @GetMapping("/archived")
    public Page<Contact> getArchived(
            HttpServletRequest request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size
    ) {
        User user = getUser(request);

        Pageable pageable = PageRequest.of(page, size);

        return contactRepository.findByUserIdAndArchivedTrue(user.getId(), pageable)
                .map(c -> Boolean.TRUE.equals(c.getArchived()) ? c : null);
    }
}